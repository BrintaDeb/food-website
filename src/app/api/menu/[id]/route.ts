import { NextRequest, NextResponse } from 'next/server';
import { getMenu, saveMenu } from '@/lib/db';
import { updateMenuItemSchema } from '@/lib/validations';
import type { MenuItem } from '@/types/menu';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateMenuItemSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: validated.error.issues.map((e: { message: string }) => e.message).join(', ')
        },
        { status: 400 }
      );
    }

    const menu = await getMenu();
    const index = menu.findIndex((it) => it.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: `Menu item "${id}" not found.` },
        { status: 404 }
      );
    }

    const currentItem = menu[index];
    if (!currentItem) {
      return NextResponse.json(
        { success: false, message: `Menu item "${id}" not found.` },
        { status: 404 }
      );
    }

    menu[index] = {
      ...currentItem,
      ...validated.data,
      ...(validated.data.spiceLevel !== undefined
        ? { spiceLevel: validated.data.spiceLevel as 1 | 2 | 3 }
        : {}),
      id
    } as MenuItem;

    await saveMenu(menu);

    return NextResponse.json({
      success: true,
      message: 'Menu item updated successfully',
      item: menu[index]
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update menu item';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const menu = await getMenu();
    const index = menu.findIndex((it) => it.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: `Menu item "${id}" not found.` },
        { status: 404 }
      );
    }

    const removed = menu.splice(index, 1)[0];
    await saveMenu(menu);

    return NextResponse.json({
      success: true,
      message: `Item "${removed?.name ?? id}" removed from menu.`
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete menu item';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
