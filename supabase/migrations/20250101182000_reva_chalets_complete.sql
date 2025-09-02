-- Location: supabase/migrations/20250101182000_reva_chalets_complete.sql
-- Complete Chalet Rental System with Admin Access and Formspree Integration
-- Schema Analysis: No existing schema - creating complete system from scratch
-- Integration Type: Complete new system
-- Dependencies: None (fresh start)

-- 1. Custom Types
CREATE TYPE public.property_type AS ENUM ('family', 'couples', 'group', 'luxury', 'budget');
CREATE TYPE public.availability_status AS ENUM ('available', 'booked', 'maintenance', 'blocked');
CREATE TYPE public.inquiry_status AS ENUM ('pending', 'responded', 'completed', 'cancelled');
CREATE TYPE public.user_role AS ENUM ('guest', 'owner', 'admin');

-- 2. Core Tables (no foreign keys)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    role public.user_role DEFAULT 'guest'::public.user_role,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Dependent Tables (with foreign keys)
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type public.property_type NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    address TEXT,
    city TEXT,
    governorate TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    features JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    contact_info JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.property_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status public.availability_status DEFAULT 'available'::public.availability_status,
    price_override DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(property_id, date)
);

CREATE TABLE public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT,
    check_in_date DATE,
    check_out_date DATE,
    guests_count INTEGER DEFAULT 1,
    status public.inquiry_status DEFAULT 'pending'::public.inquiry_status,
    owner_response TEXT,
    formspree_link TEXT DEFAULT 'https://formspree.io/f/xqadlnyo',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    guest_name TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    images JSONB DEFAULT '[]'::jsonb,
    owner_response TEXT,
    owner_response_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Indexes for performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_properties_owner_id ON public.properties(owner_id);
CREATE INDEX idx_properties_type ON public.properties(type);
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_active ON public.properties(is_active);
CREATE INDEX idx_availability_property_date ON public.property_availability(property_id, date);
CREATE INDEX idx_availability_date ON public.property_availability(date);
CREATE INDEX idx_availability_status ON public.property_availability(status);
CREATE INDEX idx_inquiries_property ON public.inquiries(property_id);
CREATE INDEX idx_inquiries_guest ON public.inquiries(guest_id);
CREATE INDEX idx_inquiries_owner ON public.inquiries(owner_id);
CREATE INDEX idx_inquiries_status ON public.inquiries(status);
CREATE INDEX idx_reviews_property ON public.reviews(property_id);

-- 5. Functions (before RLS policies)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Auto-create profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'guest'::public.user_role)
    );
    RETURN NEW;
END;
$$;

-- Helper function for admin access
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
)
$$;

-- Helper function for property owner access
CREATE OR REPLACE FUNCTION public.is_property_owner(property_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.id = property_uuid AND p.owner_id = auth.uid()
)
$$;

-- 6. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies

-- Profiles policies (Pattern 1: Core user table)
CREATE POLICY "users_manage_own_profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "public_can_view_profiles"
ON public.profiles
FOR SELECT
TO public
USING (true);

-- Properties policies (Pattern 4: Public read, private write)
CREATE POLICY "public_can_view_active_properties"
ON public.properties
FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "owners_manage_own_properties"
ON public.properties
FOR ALL
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "admins_manage_all_properties"
ON public.properties
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Property availability policies
CREATE POLICY "public_can_view_availability"
ON public.property_availability
FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM public.properties p
        WHERE p.id = property_id AND p.is_active = true
    )
);

CREATE POLICY "property_owners_manage_availability"
ON public.property_availability
FOR ALL
TO authenticated
USING (public.is_property_owner(property_id))
WITH CHECK (public.is_property_owner(property_id));

CREATE POLICY "admins_manage_all_availability"
ON public.property_availability
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Inquiries policies
CREATE POLICY "users_view_own_inquiries"
ON public.inquiries
FOR SELECT
TO authenticated
USING (
    auth.uid() = guest_id OR 
    auth.uid() = owner_id OR
    public.is_admin()
);

CREATE POLICY "authenticated_users_create_inquiries"
ON public.inquiries
FOR INSERT
TO authenticated
WITH CHECK (
    (auth.uid() = guest_id OR guest_id IS NULL) AND
    EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND is_active = true)
);

CREATE POLICY "owners_respond_to_inquiries"
ON public.inquiries
FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id OR public.is_admin())
WITH CHECK (auth.uid() = owner_id OR public.is_admin());

-- Reviews policies (Pattern 4: Public read, private write)
CREATE POLICY "public_can_view_reviews"
ON public.reviews
FOR SELECT
TO public
USING (true);

CREATE POLICY "authenticated_users_create_reviews"
ON public.reviews
FOR INSERT
TO authenticated
WITH CHECK (
    (auth.uid() = user_id OR user_id IS NULL) AND
    EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND is_active = true)
);

CREATE POLICY "users_update_own_reviews"
ON public.reviews
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "property_owners_respond_to_reviews"
ON public.reviews
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.properties p
        WHERE p.id = property_id AND p.owner_id = auth.uid()
    )
);

-- 8. Triggers
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER properties_updated_at
    BEFORE UPDATE ON public.properties
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER availability_updated_at
    BEFORE UPDATE ON public.property_availability
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER inquiries_updated_at
    BEFORE UPDATE ON public.inquiries
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('property-images', 'property-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
    ('user-avatars', 'user-avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']);

-- 10. Storage policies

-- Property images (public bucket)
CREATE POLICY "public_can_view_property_images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'property-images');

CREATE POLICY "property_owners_upload_images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'property-images' AND
    auth.uid() IS NOT NULL
);

CREATE POLICY "property_owners_manage_images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'property-images' AND owner = auth.uid())
WITH CHECK (bucket_id = 'property-images' AND owner = auth.uid());

CREATE POLICY "property_owners_delete_images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'property-images' AND owner = auth.uid());

-- User avatars (public bucket)
CREATE POLICY "public_can_view_user_avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'user-avatars');

CREATE POLICY "users_manage_own_avatars"
ON storage.objects
FOR ALL
TO authenticated
USING (
    bucket_id = 'user-avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
    bucket_id = 'user-avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

-- 11. Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    owner1_uuid UUID := gen_random_uuid();
    owner2_uuid UUID := gen_random_uuid();
    guest1_uuid UUID := gen_random_uuid();
    property1_uuid UUID := gen_random_uuid();
    property2_uuid UUID := gen_random_uuid();
    property3_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete field structure
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@revachalets.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "مدير النظام", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (owner1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'owner1@example.com', crypt('owner123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "أحمد محمود", "role": "owner"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (owner2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'owner2@example.com', crypt('owner123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "فاطمة العلي", "role": "owner"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (guest1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'guest1@example.com', crypt('guest123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "محمد الخالدي", "role": "guest"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Profiles are automatically created by trigger

    -- Update profiles with additional info
    UPDATE public.profiles SET 
        phone = '+962791234567',
        avatar_url = null
    WHERE id = admin_uuid;

    UPDATE public.profiles SET 
        phone = '+962791234568'
    WHERE id = owner1_uuid;

    UPDATE public.profiles SET 
        phone = '+962791234569'
    WHERE id = owner2_uuid;

    UPDATE public.profiles SET 
        phone = '+962791234570'
    WHERE id = guest1_uuid;

    -- Insert properties
    INSERT INTO public.properties (id, owner_id, name, description, type, price_per_night, address, city, governorate, latitude, longitude, features, images, contact_info, is_active) VALUES
    (
        property1_uuid,
        owner1_uuid,
        'شاليه الواحة الذهبية',
        'شاليه فاخر يقع في قلب الطبيعة الخلابة، يوفر تجربة إقامة مميزة للعائلات الباحثة عن الهدوء والراحة. يتميز الشاليه بتصميم عصري يجمع بين الأناقة والراحة، مع إطلالة ساحرة على المناظر الطبيعية المحيطة.',
        'family'::public.property_type,
        85.00,
        'منطقة الجبيهة، شارع الملكة رانيا',
        'عمان',
        'العاصمة',
        32.0569,
        35.8469,
        '[
            {"name": "مسبح خاص", "icon": "Waves"},
            {"name": "واي فاي مجاني", "icon": "Wifi"},
            {"name": "موقف سيارات", "icon": "Car"},
            {"name": "مطبخ مجهز", "icon": "ChefHat"},
            {"name": "تكييف مركزي", "icon": "Snowflake"},
            {"name": "شرفة مطلة", "icon": "Mountain"},
            {"name": "حديقة خاصة", "icon": "Trees"},
            {"name": "أمان 24/7", "icon": "Shield"},
            {"name": "تلفزيون ذكي", "icon": "Tv"},
            {"name": "غسالة ملابس", "icon": "Shirt"},
            {"name": "مجفف شعر", "icon": "Wind"},
            {"name": "أدوات شواء", "icon": "Flame"}
        ]'::jsonb,
        '[
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop"
        ]'::jsonb,
        '{
            "phone": "+962791234567",
            "whatsapp": "962791234567",
            "email": "info@golden-oasis-chalet.com",
            "hours": "متاح 24/7"
        }'::jsonb,
        true
    ),
    (
        property2_uuid,
        owner1_uuid,
        'شاليه النسيم الهادئ',
        'شاليه مريح ومثالي للأزواج الباحثين عن الرومانسية والهدوء. يحتوي على جاكوزي خاص ومنطقة جلوس خارجية مع إطلالة رائعة.',
        'couples'::public.property_type,
        65.00,
        'منطقة دابوق، شارع الأردن',
        'عمان',
        'العاصمة',
        32.0123,
        35.8234,
        '[
            {"name": "جاكوزي خاص", "icon": "Bath"},
            {"name": "إنترنت مجاني", "icon": "Wifi"},
            {"name": "موقف سيارة", "icon": "Car"},
            {"name": "مطبخ صغير", "icon": "ChefHat"},
            {"name": "تدفئة مركزية", "icon": "Thermometer"},
            {"name": "منطقة جلوس خارجية", "icon": "Armchair"}
        ]'::jsonb,
        '[
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop"
        ]'::jsonb,
        '{
            "phone": "+962791234568",
            "whatsapp": "962791234568",
            "email": "info@breeze-chalet.com",
            "hours": "9:00 ص - 9:00 م"
        }'::jsonb,
        true
    ),
    (
        property3_uuid,
        owner2_uuid,
        'شاليه المرح الكبير',
        'شاليه واسع مخصص للمجموعات الكبيرة والفعاليات. يتسع لـ 12 شخص ويحتوي على قاعة كبيرة ومسبح واسع.',
        'group'::public.property_type,
        150.00,
        'منطقة عبدون، الدوار السابع',
        'عمان',
        'العاصمة',
        31.9567,
        35.9123,
        '[
            {"name": "مسبح كبير", "icon": "Waves"},
            {"name": "قاعة فعاليات", "icon": "Users"},
            {"name": "باربيكيو", "icon": "Flame"},
            {"name": "موقف 6 سيارات", "icon": "Car"},
            {"name": "مطبخ كامل", "icon": "ChefHat"},
            {"name": "نظام صوت", "icon": "Speaker"}
        ]'::jsonb,
        '[
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
        ]'::jsonb,
        '{
            "phone": "+962791234570",
            "whatsapp": "962791234570",
            "email": "info@big-fun-chalet.com",
            "hours": "24/7"
        }'::jsonb,
        true
    );

    -- Insert availability (next 90 days)
    INSERT INTO public.property_availability (property_id, date, status)
    SELECT 
        p.id,
        current_date + (interval '1 day' * generate_series(0, 89)),
        CASE 
            WHEN random() < 0.1 THEN 'booked'::public.availability_status
            WHEN random() < 0.05 THEN 'maintenance'::public.availability_status
            ELSE 'available'::public.availability_status
        END
    FROM public.properties p
    WHERE p.is_active = true;

    -- Insert sample inquiries
    INSERT INTO public.inquiries (property_id, guest_id, owner_id, message, guest_name, guest_email, guest_phone, check_in_date, check_out_date, guests_count, status)
    VALUES
        (property1_uuid, guest1_uuid, owner1_uuid, 'أود الاستفسار عن توفر الشاليه للعطلة القادمة', 'محمد الخالدي', 'guest1@example.com', '+962791234570', current_date + interval '7 days', current_date + interval '9 days', 4, 'pending'::public.inquiry_status),
        (property2_uuid, null, owner1_uuid, 'هل يتوفر الشاليه لقضاء شهر العسل؟', 'سارة أحمد', 'sara@example.com', '+962791234571', current_date + interval '14 days', current_date + interval '16 days', 2, 'responded'::public.inquiry_status);

    -- Insert sample reviews
    INSERT INTO public.reviews (property_id, user_id, rating, comment, guest_name, is_verified, helpful_count, images, owner_response, owner_response_date)
    VALUES
    (
        property1_uuid,
        guest1_uuid,
        5,
        'إقامة رائعة جداً! الشاليه نظيف ومجهز بكل ما نحتاجه. المسبح كان مثالي للأطفال والإطلالة خلابة. الموقع هادئ ومريح للعائلة. بالتأكيد سنعود مرة أخرى.',
        'محمد الخالدي',
        true,
        12,
        '[
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop"
        ]'::jsonb,
        null,
        null
    ),
    (
        property1_uuid,
        null,
        4,
        'شاليه جميل ومريح، المطبخ مجهز بشكل ممتاز. الوحيد الملاحظة أن الواي فاي كان بطيء قليلاً، لكن بشكل عام تجربة ممتازة.',
        'فاطمة العلي',
        true,
        8,
        '[]'::jsonb,
        'شكراً لك على التقييم. تم تحسين سرعة الإنترنت وأصبح أفضل الآن. نتطلع لاستقبالك مرة أخرى.',
        NOW() - interval '1 day'
    );

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error during mock data insertion: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error during mock data insertion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error during mock data insertion: %', SQLERRM;
END $$;

-- 12. Utility Functions
CREATE OR REPLACE FUNCTION public.get_property_availability(
    property_uuid UUID,
    start_date DATE,
    end_date DATE
)
RETURNS TABLE (
    date DATE,
    status public.availability_status,
    price DECIMAL(10,2)
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT 
        pa.date,
        pa.status,
        COALESCE(pa.price_override, p.price_per_night) as price
    FROM public.property_availability pa
    JOIN public.properties p ON p.id = pa.property_id
    WHERE pa.property_id = property_uuid
        AND pa.date BETWEEN start_date AND end_date
    ORDER BY pa.date;
$$;

-- Function to update availability (for owners)
CREATE OR REPLACE FUNCTION public.update_property_availability(
    property_uuid UUID,
    date_to_update DATE,
    new_status public.availability_status,
    price_override DECIMAL(10,2) DEFAULT NULL
)
RETURNS BOOLEAN 
SECURITY DEFINER
LANGUAGE plpgsql 
AS $$
DECLARE
    owner_check UUID;
BEGIN
    -- Check if current user owns the property or is admin
    SELECT owner_id INTO owner_check 
    FROM public.properties 
    WHERE id = property_uuid;
    
    IF owner_check != auth.uid() AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'You do not have permission to modify this property availability';
    END IF;
    
    -- Update or insert availability
    INSERT INTO public.property_availability (property_id, date, status, price_override)
    VALUES (property_uuid, date_to_update, new_status, price_override)
    ON CONFLICT (property_id, date) 
    DO UPDATE SET 
        status = new_status,
        price_override = COALESCE(public.update_property_availability.price_override, property_availability.price_override),
        updated_at = CURRENT_TIMESTAMP;
        
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error updating availability: %', SQLERRM;
        RETURN FALSE;
END;
$$;