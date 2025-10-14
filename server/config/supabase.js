import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
}

const BUCKET_NAME = "dictation_app";

const supabaseClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: true,
            persistSession: false
        }
    }
);

export const getSupabaseClient = () => supabaseClient;

/**
 * Get a signed URL for a file in Supabase Storage
 * @param {string} bucket - The bucket name
 * @param {string} filePath - The file path in the bucket
 * @param {number} expiresIn - Expiration time in seconds (default: 3600 = 1 hour)
 * @returns {Promise<{url: string | null, error: Error | null}>}
 */
export const getSignedUrl = async (bucket, filePath, expiresIn = 3600) => {
    try {
        const { data, error } = await supabaseClient.storage
            .from(`${BUCKET_NAME}/${bucket}`)
            .createSignedUrl(filePath, expiresIn);

        if (error) {
            console.error('Error creating signed URL:', error);
            return { url: null, error };
        }

        return { url: data.signedUrl, error: null };
    } catch (error) {
        console.error('Error in getSignedUrl:', error);
        return { url: null, error };
    }
};

/**
 * Get a public URL for a file in Supabase Storage
 * @param {string} bucket - The bucket name
 * @param {string} filePath - The file path in the bucket
 * @returns {string} The public URL
 */
export const getPublicUrl = (bucket, filePath) => {
    const { data } = supabaseClient.storage
        .from(`${BUCKET_NAME}/${bucket}`)
        .getPublicUrl(filePath);
    
    return data.publicUrl;
};

export default supabaseClient;