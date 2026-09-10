import { NextRequest, NextResponse } from 'next/server';
import { getMenu, saveMenu } from '@/lib/db';
import { menuItemSchema } from '@/lib/validations';
import type { MenuItem } from '@/types/menu';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const inStockOnly = searchParams.get('inStock') === 'true';

    const menu = await getMenu();
    let filtered = menu;

    if (category && category !== 'All') {
      filtered = filtered.filter(
        (item) => (item.category || '').toLowerCase() === category.toLowerCase()
      );
    }
    if (inStockOnly) {
      filtered = filtered.filter((item) => item.inStock !== false);
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      items: filtered
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch menu';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = menuItemSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: validated.error.issues.map((e: { message: string }) => e.message).join(', ')
        },
        { status: 400 }
      );
    }

    const {
      name,
      category,
      price,
      image,
      description,
      inStock,
      prepTime,
      isVeg,
      spiceLevel,
      tags
    } = validated.data;
    const menu = await getMenu();

    const id =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `item-${Date.now()}`;

    const newItem: MenuItem = {
      id,
      name: name.trim(),
      category: category || 'Biryani',
      price,
      image: image || '/images/kolkata-biryani.jpg',
      description: description || '',
      inStock: inStock !== false,
      prepTime: prepTime || '20 mins',
      isVeg: !!isVeg,
      spiceLevel: (spiceLevel as 1 | 2 | 3) || 1,
      tags: tags || []
    };

    menu.push(newItem);
    await saveMenu(menu);

    return NextResponse.json(
      {
        success: true,
        message: 'Menu item created successfully',
        item: newItem
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create menu item';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
