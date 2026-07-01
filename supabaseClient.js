// Supabase client initialization and database helpers
let supabaseInstance = null;

/**
 * Initializes and returns the Supabase client instance.
 * Reads config from window.SUPABASE_URL / window.SUPABASE_ANON_KEY,
 * which config.js sets before this script runs.
 */
async function getSupabaseClient() {
    if (supabaseInstance) return supabaseInstance;

    let url = window.SUPABASE_URL;
    const anonKey = window.SUPABASE_ANON_KEY;

    if (!url || !anonKey || url.includes('YOUR_SUPABASE_URL_HERE') || anonKey.includes('YOUR_SUPABASE_ANON_KEY_HERE')) {
        console.error('Supabase credentials (SUPABASE_URL, SUPABASE_ANON_KEY) are missing or set to placeholder.');
        return null;
    }

    // Clean URL: Supabase JS client expects the project base URL (e.g. https://xxxx.supabase.co)
    // and not the REST API endpoint (https://xxxx.supabase.co/rest/v1/)
    url = url.trim();
    if (url.endsWith('/rest/v1/')) {
        url = url.slice(0, -9);
    } else if (url.endsWith('/rest/v1')) {
        url = url.slice(0, -8);
    }

    if (window.supabase) {
        supabaseInstance = window.supabase.createClient(url, anonKey);
        console.log('Supabase client initialized successfully at ' + url);
    } else {
        console.error('Supabase UMD library not loaded. Make sure script is included in HTML.');
    }

    return supabaseInstance;
}

/**
 * Handles basic email and password login using Supabase authentication.
 */
async function supabaseLogin(email, password) {
    const supabase = await getSupabaseClient();
    if (!supabase) {
        throw new Error('Supabase client is not initialized.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        throw error;
    }
    return data;
}

/**
 * Handles basic email and password registration using Supabase authentication.
 */
async function supabaseRegister(email, password, displayName) {
    const supabase = await getSupabaseClient();
    if (!supabase) {
        throw new Error('Supabase client is not initialized.');
    }

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                display_name: displayName
            }
        }
    });

    if (error) {
        throw error;
    }
    return data;
}

/**
 * Placeholder function to insert a product into a cart_items table in Supabase.
 */
async function insertCartItem(productId, quantity, price) {
    const supabase = await getSupabaseClient();
    if (!supabase) {
        throw new Error('Supabase client is not initialized.');
    }

    // Try to get current active user session to bind to cart item
    const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));

    const { data, error } = await supabase
        .from('cart_items')
        .insert([
            {
                user_id: user ? user.id : null,
                product_id: productId,
                quantity: quantity,
                price: price,
                created_at: new Date().toISOString()
            }
        ])
        .select();

    if (error) {
        console.error('Error inserting cart item to database:', error);
        throw error;
    }

    console.log('Cart item successfully synchronized to Supabase table:', data);
    return data;
}

/**
 * Fetches all cart items for the currently logged-in user.
 */
async function fetchCartItems() {
    const supabase = await getSupabaseClient();
    if (!supabase) {
        return [];
    }

    const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
    if (!user) {
        return [];
    }

    const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

    if (error) {
        console.error('Error fetching cart items from database:', error);
        return [];
    }

    return data;
}

/**
 * Inserts a new cart item or updates quantity if it already exists in the database.
 */
async function upsertCartItem(productId, quantity, price) {
    const supabase = await getSupabaseClient();
    if (!supabase) return;

    const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
    if (!user) return;

    // Check if the item already exists for this user
    const { data: existingItems, error: fetchError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId);

    if (fetchError) {
        console.error('Error checking existing cart item:', fetchError);
    }

    if (existingItems && existingItems.length > 0) {
        const newQty = existingItems[0].quantity + quantity;
        const { error: updateError } = await supabase
            .from('cart_items')
            .update({ quantity: newQty })
            .eq('id', existingItems[0].id);

        if (updateError) {
            console.error('Error updating existing cart item quantity:', updateError);
            throw updateError;
        }
    } else {
        const { error: insertError } = await supabase
            .from('cart_items')
            .insert([
                {
                    user_id: user.id,
                    product_id: productId,
                    quantity: quantity,
                    price: price,
                    created_at: new Date().toISOString()
                }
            ]);

        if (insertError) {
            console.error('Error inserting new cart item:', insertError);
            throw insertError;
        }
    }
}

/**
 * Updates the quantity of a specific cart item in the database.
 */
async function updateCartItemQuantity(productId, quantity) {
    const supabase = await getSupabaseClient();
    if (!supabase) return;

    const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
    if (!user) return;

    const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId);

    if (error) {
        console.error('Error updating cart item quantity in database:', error);
        throw error;
    }
}

/**
 * Deletes a specific cart item from the database.
 */
async function deleteCartItem(productId) {
    const supabase = await getSupabaseClient();
    if (!supabase) return;

    const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
    if (!user) return;

    const { data, error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

    if (error) {
        console.error('Error deleting cart item from database:', error);
        throw error;
    }
}

/**
 * Deletes all cart items for the logged-in user from the database.
 */
async function clearUserCart() {
    const supabase = await getSupabaseClient();
    if (!supabase) return;

    const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
    if (!user) return;

    const { data, error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

    if (error) {
        console.error('Error clearing cart in database:', error);
        throw error;
    }
}

/**
 * Merges a list of guest cart items into the user's database cart.
 */
async function mergeGuestCart(guestCartItems) {
    if (!guestCartItems || guestCartItems.length === 0) return;

    const supabase = await getSupabaseClient();
    if (!supabase) return;

    const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
    if (!user) return;

    for (const item of guestCartItems) {
        try {
            await upsertCartItem(item.id, item.quantity, item.price);
        } catch (err) {
            console.error('Error merging guest item:', item.id, err);
        }
    }
}

// Expose functions globally for UMD script inclusion access
window.getSupabaseClient = getSupabaseClient;
window.supabaseLogin = supabaseLogin;
window.supabaseRegister = supabaseRegister;
window.insertCartItem = insertCartItem;
window.fetchCartItems = fetchCartItems;
window.upsertCartItem = upsertCartItem;
window.updateCartItemQuantity = updateCartItemQuantity;
window.deleteCartItem = deleteCartItem;
window.clearUserCart = clearUserCart;
window.mergeGuestCart = mergeGuestCart;

