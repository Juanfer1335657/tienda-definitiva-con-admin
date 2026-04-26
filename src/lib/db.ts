import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL!);

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  created_at: Date;
}

export async function getProducts(): Promise<Product[]> {
  const result = await sql`SELECT * FROM products ORDER BY created_at DESC`;
  return result as unknown as Product[];
}

export async function getProduct(id: number): Promise<Product | null> {
  const result = await sql`SELECT * FROM products WHERE id = ${id}`;
  const products = result as unknown as Product[];
  return products[0] || null;
}

export async function createProduct(data: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
  const result = await sql`
    INSERT INTO products (name, description, price, image_url, category) 
    VALUES (${data.name}, ${data.description}, ${data.price}, ${data.image_url}, ${data.category}) 
    RETURNING *`;
  return result[0] as unknown as Product;
}

export async function updateProduct(id: number, data: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<Product> {
  const sets: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (data.name !== undefined) {
    sets.push(`name = $${idx++}`);
    values.push(data.name);
  }
  if (data.description !== undefined) {
    sets.push(`description = $${idx++}`);
    values.push(data.description);
  }
  if (data.price !== undefined) {
    sets.push(`price = $${idx++}`);
    values.push(data.price);
  }
  if (data.image_url !== undefined) {
    sets.push(`image_url = $${idx++}`);
    values.push(data.image_url);
  }
  if (data.category !== undefined) {
    sets.push(`category = $${idx++}`);
    values.push(data.category);
  }

  values.push(id);
  const result = await sql`UPDATE products SET ${sets.join(', ')} WHERE id = ${id} RETURNING *`;
  return result[0] as unknown as Product;
}

export async function deleteProduct(id: number): Promise<void> {
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