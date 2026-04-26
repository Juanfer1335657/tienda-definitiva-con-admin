import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL!);

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  created_at: Date;
  images?: ProductImage[];
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  is_primary: boolean;
}

export interface ProductWithImages extends Product {
  images: ProductImage[];
}

export async function getProducts(): Promise<ProductWithImages[]> {
  const products = await sql`SELECT * FROM products ORDER BY created_at DESC`;
  const productsData = products as unknown as Product[];
  
  const productsWithImages: ProductWithImages[] = await Promise.all(
    productsData.map(async (product) => {
      const images = await sql`SELECT * FROM product_images WHERE product_id = ${product.id} ORDER BY is_primary DESC, created_at ASC`;
      return {
        ...product,
        images: images as unknown as ProductImage[],
      };
    })
  );
  
  return productsWithImages;
}

export async function getProduct(id: number): Promise<ProductWithImages | null> {
  const result = await sql`SELECT * FROM products WHERE id = ${id}`;
  const products = result as unknown as Product[];
  const product = products[0];
  
  if (!product) return null;
  
  const images = await sql`SELECT * FROM product_images WHERE product_id = ${id} ORDER BY is_primary DESC, created_at ASC`;
  
  return {
    ...product,
    images: images as unknown as ProductImage[],
  };
}

export async function createProduct(data: { name: string; description: string | null; price: number; category: string | null; images: string[] }): Promise<ProductWithImages> {
  const result = await sql`
    INSERT INTO products (name, description, price, category) 
    VALUES (${data.name}, ${data.description}, ${data.price}, ${data.category}) 
    RETURNING *`;
  
  const product = result[0] as unknown as Product;
  
  const productImages: ProductImage[] = [];
  for (let i = 0; i < data.images.length; i++) {
    const imageResult = await sql`
      INSERT INTO product_images (product_id, image_url, is_primary) 
      VALUES (${product.id}, ${data.images[i]}, ${i === 0}) 
      RETURNING *`;
    productImages.push(imageResult[0] as unknown as ProductImage);
  }
  
  return { ...product, images: productImages };
}

export async function updateProduct(id: number, data: { name?: string; description?: string | null; price?: number; category?: string | null; images?: string[] }): Promise<ProductWithImages | null> {
  if (data.name !== undefined || data.description !== undefined || data.price !== undefined || data.category !== undefined) {
    await sql`
      UPDATE products 
      SET 
        name = COALESCE(${data.name}, name),
        description = COALESCE(${data.description}, description),
        price = COALESCE(${data.price}, price),
        category = COALESCE(${data.category}, category)
      WHERE id = ${id}`;
  }
  
  if (data.images !== undefined) {
    await sql`DELETE FROM product_images WHERE product_id = ${id}`;
    
    const productImages: ProductImage[] = [];
    for (let i = 0; i < data.images.length; i++) {
      const imageResult = await sql`
        INSERT INTO product_images (product_id, image_url, is_primary) 
        VALUES (${id}, ${data.images[i]}, ${i === 0}) 
        RETURNING *`;
      productImages.push(imageResult[0] as unknown as ProductImage);
    }
    
    const product = await getProduct(id);
    if (!product) return null;
    return { ...product, images: productImages };
  }
  
  return await getProduct(id);
}

export async function deleteProduct(id: number): Promise<void> {
  await sql`DELETE FROM product_images WHERE product_id = ${id}`;
  await sql`DELETE FROM products WHERE id = ${id}`;
}

export interface Admin {
  id: number;
  email: string;
  password_hash: string;
}

export async function getAdmin(email: string): Promise<Admin | null> {
  const result = await sql`SELECT * FROM admins WHERE email = ${email}`;
  const admins = result as unknown as Admin[];
  return admins[0] || null;
}

export async function createAdmin(email: string, passwordHash: string): Promise<Admin> {
  const result = await sql`
    INSERT INTO admins (email, password_hash) VALUES (${email}, ${passwordHash}) 
    RETURNING *`;
  return result[0] as unknown as Admin;
}