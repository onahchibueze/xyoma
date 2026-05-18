import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

/**
 * API Route to handle secure image uploads to Cloudinary.
 * Only authenticated users can upload. Admins can specify folders.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { image, folder = 'misc' } = body;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Restrict folder access for non-admins
    let targetFolder: 'products' | 'users' | 'misc' = 'misc';
    if (session.user.role === 'admin') {
      targetFolder = folder;
    } else {
      // Regular users can only upload to users folder (e.g., for avatars)
      targetFolder = 'users';
    }

    const result = await uploadImage(image, targetFolder);

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error: unknown) {
    console.error('Upload API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
