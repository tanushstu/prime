// Shared JavaScript for Prime Hydration multi-page site
// Handles Cart, Mobile Nav, Search, Accessibility, and General Interactivity

(function () {
    // ----------------------------------------------------
    // 1. Inject Stylesheets & Dynamic Styles
    // ----------------------------------------------------
    const styles = `
        /* General Utilities */
        .sharp-border {
            border-radius: 0px !important;
        }
        
        /* Slide-out Drawers */
        .drawer-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(4px);
            z-index: 1000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease-in-out;
        }
        .drawer-backdrop.active {
            opacity: 1;
            pointer-events: auto;
        }
        .slide-drawer {
            position: fixed;
            top: 0;
            bottom: 0;
            right: 0;
            width: 100%;
            max-width: 450px;
            background: #ffffff;
            border-left: 2px solid #000000;
            z-index: 1001;
            transform: translateX(100%);
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            flex-direction: column;
        }
        .slide-drawer.left-drawer {
            left: 0;
            right: auto;
            border-left: none;
            border-right: 2px solid #000000;
            transform: translateX(-100%);
        }
        .slide-drawer.active {
            transform: translateX(0);
        }
        
        /* Accessibility Panel */
        .access-panel {
            position: fixed;
            bottom: 80px;
            left: 20px;
            background: #ffffff;
            border: 2px solid #000000;
            padding: 16px;
            width: 280px;
            z-index: 999;
            transform: translateY(20px);
            opacity: 0;
            pointer-events: none;
            transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .access-panel.active {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
        }

        /* Search Overlay */
        .search-overlay {
            position: fixed;
            inset: 0;
            background: rgba(255, 255, 255, 0.98);
            z-index: 1002;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
            overflow-y: auto;
            padding: 40px 20px;
        }
        .search-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        /* Custom Toast Notification */
        .toast-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #000000;
            color: #ffffff;
            border: 2px solid #ffffff;
            padding: 16px 24px;
            font-family: 'Archivo Narrow', sans-serif;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            z-index: 10000;
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        }
        .toast-notification.active {
            transform: translateY(0);
            opacity: 1;
        }
        
        /* Accessibility Overrides */
        .high-contrast {
            background-color: #ffffff !important;
            color: #000000 !important;
            border-color: #000000 !important;
        }
        .high-contrast * {
            border-color: #000000 !important;
            outline: 2px solid #000000 !important;
        }
        
        /* Modal dialog default */
        .custom-modal {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.75);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10005;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
        }
        .custom-modal.active {
            opacity: 1;
            pointer-events: auto;
        }
    `;
    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);

    // ----------------------------------------------------
    // 2. Global State Variables
    // ----------------------------------------------------
    let cart = [];
    const mockProducts = [
        {
            id: 'ice-pop',
            name: 'Ice Pop',
            price: 29.99,
            imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrEXBGkDEBmdXq8UK6477VcU0e2CS2GNFiptPzL9Kq4Gi-GEQV3MNwo1kz88vxc3DX5byYgfhixcLqmzE6U5Ekkpy5DyfZEw_mGoE34xnhP7vH3wnfN_Oggw5-v0bUHJRLZCJQKsMGWFA6KvpZmnIyrhQSL8stLAS2t5tUTlWmGRAof1MrvVMeK3Rnnska715A54HUogs-Of1C9ajZQr3J8bVoYZP54FgooG8F86f3sJHCL-K6SoDZ684vx2p98zOzuWhOzzfLQmq8',
            url: '../prime_hydration_ice_pop/code.html',
            category: 'Hydration Drink'
        },
        {
            id: 'ice-pop-zero',
            name: 'Ice Pop (Zero)',
            price: 29.99,
            imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuAn8Eq0Ao7KGefMSJ3deKX0MafjFj-fCPaCS92uDEUHLUjbzIspQpt3YTL_YKNhVuJ3j3oiRJqK3cyv_f4UZNl2RcDIqxBeturZHkWFI2G7gsxZOfrAtyDydhpTw8UvCw0bs48yHi6ZhRk1HJogcvtp4-STcLJrNznycFDa1masmUZjGCU1wN0_AyOCmmruHwLXCywt0agbCQQ1VHt33xEMPrKuS49DCTQnNqqgQ_X9uOT0frUUk15MtZA0t3vHNyaAHReHzNNogr',
            url: '#',
            category: 'Hydration Drink'
        },
        {
            id: 'mega-variety-pack',
            name: 'Mega Variety Pack',
            price: 34.99,
            imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDD3FYYNGd4TQB8SYPmA35EImbis_EWe9GM81fbEL3SI6nPw7xSVOJNNX1cxUTO7bRUDJzg7vrSL1MWT4qYGmaXu4nzrPNPqzvAvYtThaC8zSb-TvQdQBgQxYXGTYWqP0ZwL84KK9mQ55XhMPxlM9XMyIoI2gmjxZAghI7aNC7rZZeEx8hwrJMpVb7omV30czEAKMbN0xwrkjvCisIYP1l55zJnaCt5URsLtKZ3f7PP_9Do4bipJjYeUljkFLmki0LmVCBuUIA-h29z',
            url: '#',
            category: 'Variety Packs'
        },
        {
            id: 'strawberry-swirl',
            name: 'Strawberry Swirl',
            price: 29.99,
            imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu2RIV-9Sdl6ewcU1kaWuGXlZGzBvVN4PEcn773hBMnlOCotNkq5xbh7Ai1tOoWm1_VoDqYGseBB0tkoEeG2NR4HQD5DJYEwMzD1ectySk_5Z6HP-231ik3ThNSz0uJJOtrxsr_0T8bG9yR92ikPFk5jJssPKi26ztTTNJBVvqKYe1zZoWSqmxSc7mY5KN9vyOnzfnuacb0j-DVQobea_GxZTBcv-cbp8YcUqECiadhbPbbg_QeqrQKfwCSmACP584VtLZe0kUScf6',
            url: '#',
            category: 'Hydration Drink'
        },
        {
            id: 'frostbite-fusion',
            name: 'Frostbite Fusion',
            price: 32.99,
            imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByLqH9L1nDqvxGC-11gfZDi-tLY3wl5RS0hR5M0OXLG9gL4gOGw37fjrPj5hb2SEBNd-JdwPEodHYjO7QdbZiclgNjEuo8gTqZpZBinXQukhqwUlmksfecrTKPv20oIWNm7Z7b5miZK3EVIUcDWSWsO95rOCBmltlX_DQjs-7lnuwyWK-VnKIQhV0mylvclXgAqShlFDxCC9eV3HTDpiN7jxQPfIMbl0ABGbXzuUpXn3jwRwq8I6MB13es9uhvtnrjR3wpM8--aXkX',
            url: '#',
            category: 'Energy Drink'
        },
        {
            id: 'citrus-tide-mix',
            name: 'Citrus Tide Mix',
            price: 34.99,
            imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoZtH_se6eZuconFi8soaMEyhqSAdCLNuh4LIVVg4-Os-CtZ4Laz1w69PaDHfKjnS84PJuDBkgdT_cRUqy11_jNBqUCFa65Yu9Yg4OtoztcJNDuXRC6CAMBDDfwduwDtfqCeY3-wGd_GIM_6KuIFxAeujWDaaAM8ZdEdnj_JtVZpuT9uDej3CFn5N6_Ei9tvv19m-4U3iM0g21ZpGFnSAj7jSlZBVRate-EhYhpEYSY38wxBWhYDbpo1C6Z1oFf4BWDOxDRzorMZPD',
            url: '#',
            category: 'Variety Packs'
        }
    ];

    // Initialize Page on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', init);

    async function init() {
        loadCart();
        injectUIElements();
        setupGlobalEventListeners();
        setupPageSpecificFeatures();
        updateHeaderNavLinks();
        checkAccessibilityPreferences();
        await loadSupabaseScripts();

        // Monitor and sync Supabase authentication sessions (e.g. from Google OAuth redirects)
        if (typeof window.getSupabaseClient === 'function') {
            try {
                const client = await window.getSupabaseClient();
                if (client) {
                    client.auth.onAuthStateChange(async (event, session) => {
                        console.log('Supabase Auth Event:', event, session);
                        if (session && session.user) {
                            const user = session.user;
                            const primeUser = {
                                name: (user.user_metadata?.display_name || user.email.split('@')[0]).toUpperCase(),
                                email: user.email,
                                joined: new Date(user.created_at).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' })
                            };
                            localStorage.setItem('prime_user', JSON.stringify(primeUser));

                            // Merge guest cart if any exists
                            try {
                                const guestKey = 'prime_cart_guest';
                                const storedGuest = localStorage.getItem(guestKey);
                                const guestCart = storedGuest ? JSON.parse(storedGuest) : [];
                                if (guestCart && guestCart.length > 0) {
                                    if (typeof window.mergeGuestCart === 'function') {
                                        await window.mergeGuestCart(guestCart);
                                        localStorage.removeItem(guestKey);
                                    }
                                }
                            } catch (e) {
                                console.error('Error merging guest cart:', e);
                            }
                        } else if (event === 'SIGNED_OUT') {
                            localStorage.removeItem('prime_user');
                        }
                        // Reload cart to use the individualized storage key for this user state
                        await loadCart();
                    });
                }
            } catch (err) {
                console.warn('Supabase Auth State sync failed:', err);
            }
        }
    }

    /**
     * Dynamically load Supabase UMD bundle and our client helper script.
     * This ensures all pages are database-ready without manually editing head scripts.
     */
    function loadSupabaseScripts() {
        return new Promise((resolve) => {
            if (window.supabase && window.insertCartItem) {
                resolve();
                return;
            }

            const baseDir = window.location.pathname.includes('/prime/')
                ? '/prime/'
                : '/';

            const sbScript = document.createElement('script');
            sbScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
            sbScript.onload = () => {
                const configScript = document.createElement('script');
                configScript.src = baseDir + 'config.js?v=1.0.1';
                configScript.onload = () => {
                    const clientScript = document.createElement('script');
                    clientScript.src = baseDir + 'supabaseClient.js?v=1.0.1';
                    clientScript.onload = () => {
                        resolve();
                    };
                    document.head.appendChild(clientScript);
                };
                document.head.appendChild(configScript);
            };
            sbScript.onerror = () => {
                console.warn('Dynamic loading of Supabase library skipped or offline.');
                resolve();
            };
            document.head.appendChild(sbScript);
        });
    }

    // ----------------------------------------------------
    // 3. Cart State Management
    // ----------------------------------------------------
    function getCartStorageKey() {
        try {
            const storedUser = localStorage.getItem('prime_user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                if (user && user.email) {
                    const sanitizedEmail = user.email.toLowerCase().replace(/[^a-z0-9]/g, '_');
                    return `prime_cart_${sanitizedEmail}`;
                }
            }
        } catch (e) {
            console.error('Error reading prime_user to determine cart key:', e);
        }
        return 'prime_cart_guest';
    }

    async function loadCart() {
        try {
            const key = getCartStorageKey();
            const storedUser = localStorage.getItem('prime_user');

            let loadedCart = [];
            let loadedFromDb = false;

            if (storedUser && typeof window.fetchCartItems === 'function') {
                try {
                    const dbItems = await window.fetchCartItems();
                    if (dbItems && Array.isArray(dbItems)) {
                        loadedCart = dbItems.map(dbItem => {
                            const p = mockProducts.find(prod => prod.id === dbItem.product_id);
                            return {
                                id: dbItem.product_id,
                                name: p ? p.name : dbItem.product_id,
                                price: dbItem.price,
                                imageSrc: p ? p.imageSrc : '',
                                quantity: dbItem.quantity
                            };
                        });
                        loadedFromDb = true;
                        // Update cache
                        localStorage.setItem(key, JSON.stringify(loadedCart));
                    }
                } catch (dbErr) {
                    console.warn('Failed to load cart from Supabase database, falling back to local storage cache:', dbErr);
                }
            }

            if (!loadedFromDb) {
                const stored = localStorage.getItem(key);
                loadedCart = stored ? JSON.parse(stored) : [];
            }

            cart = loadedCart;
        } catch (e) {
            console.error('Error loading cart:', e);
            cart = [];
        }
        updateCartBadges();

        // If the cart drawer is active, re-render the items list
        const drawer = document.getElementById('cart-drawer');
        if (drawer && drawer.classList.contains('active')) {
            renderCartItems();
        }
    }

    function saveCart() {
        try {
            const key = getCartStorageKey();
            localStorage.setItem(key, JSON.stringify(cart));
        } catch (e) {
            console.error('Error saving cart:', e);
        }
        updateCartBadges();
        renderCartItems();
    }

    async function addToCart(product, quantity = 1) {
        if (!requireLoginOrPrompt()) return;

        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                imageSrc: product.imageSrc,
                quantity: quantity
            });
        }
        saveCart();
        showToast(`ADDED ${quantity} x ${product.name.toUpperCase()} TO CART!`);
        openCartDrawer();

        // Sync to Supabase cart_items table if connection is active
        if (typeof window.upsertCartItem === 'function') {
            try {
                await window.upsertCartItem(product.id, quantity, product.price);
            } catch (err) {
                console.warn('Supabase sync warning (could not upsert to cart_items):', err.message || err);
            }
        }
    }

    async function updateQuantity(productId, change) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            const newQty = item.quantity;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.id !== productId);
            }
            saveCart();

            // Sync to Supabase
            if (typeof window.getSupabaseClient === 'function') {
                try {
                    if (newQty <= 0) {
                        if (typeof window.deleteCartItem === 'function') {
                            await window.deleteCartItem(productId);
                        }
                    } else {
                        if (typeof window.updateCartItemQuantity === 'function') {
                            await window.updateCartItemQuantity(productId, newQty);
                        }
                    }
                } catch (err) {
                    console.warn('Supabase quantity sync failed:', err);
                }
            }
        }
    }

    async function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();

        // Sync to Supabase
        if (typeof window.deleteCartItem === 'function') {
            try {
                await window.deleteCartItem(productId);
            } catch (err) {
                console.warn('Supabase delete sync failed:', err);
            }
        }
    }

    async function clearCart() {
        cart = [];
        saveCart();

        // Sync to Supabase
        if (typeof window.clearUserCart === 'function') {
            try {
                await window.clearUserCart();
            } catch (err) {
                console.warn('Supabase clear sync failed:', err);
            }
        }
    }

    function getCartTotal() {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    function getCartItemCount() {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // ----------------------------------------------------
    // 4. UI Injection
    // ----------------------------------------------------
    function injectUIElements() {
        // Create Backdrops and Drawer containers
        const body = document.body;

        // 1. Cart Drawer
        const cartHtml = `
            <div id="cart-backdrop" class="drawer-backdrop"></div>
            <div id="cart-drawer" class="slide-drawer">
                <div class="flex justify-between items-center p-6 border-b-2 border-black">
                    <h2 class="font-headline-lg text-headline-lg-mobile text-black uppercase tracking-tight">YOUR CART</h2>
                    <button id="cart-close" class="text-black hover:text-secondary p-1 flex items-center justify-center">
                        <span class="material-symbols-outlined text-[32px]">close</span>
                    </button>
                </div>
                <div id="cart-items-container" class="flex-grow overflow-y-auto p-6 flex flex-col gap-4">
                    <!-- Dynamic Cart Items Go Here -->
                </div>
                <div class="p-6 border-t-2 border-black bg-surface-container-low flex flex-col gap-4">
                    <div class="flex justify-between font-title-md text-title-md text-black uppercase">
                        <span>SUBTOTAL:</span>
                        <span id="cart-subtotal-val">$0.00</span>
                    </div>
                    <button id="checkout-btn" class="w-full bg-black text-white hover:bg-secondary hover:text-white font-title-md text-title-md h-16 uppercase transition-colors sharp-border">
                        CHECKOUT
                    </button>
                </div>
            </div>
        `;
        body.insertAdjacentHTML('beforeend', cartHtml);

        // Profile Drawer
        const profileHtml = `
            <div id="profile-backdrop" class="drawer-backdrop"></div>
            <div id="profile-drawer" class="slide-drawer">
                <div class="flex justify-between items-center p-6 border-b-2 border-black">
                    <h2 class="font-headline-lg text-headline-lg-mobile text-black uppercase tracking-tight">MEMBER PROFILE</h2>
                    <button id="profile-close" class="text-black hover:text-secondary p-1 flex items-center justify-center">
                        <span class="material-symbols-outlined text-[32px]">close</span>
                    </button>
                </div>
                <div id="profile-info-container" class="flex-grow overflow-y-auto p-6 flex flex-col gap-6 text-black">
                    <!-- Dynamic Profile Content -->
                </div>
            </div>
        `;
        body.insertAdjacentHTML('beforeend', profileHtml);

        // Dynamically add Profile icon next to cart icon in header
        document.querySelectorAll('header button, header a').forEach(el => {
            const iconSpan = el.querySelector('.material-symbols-outlined');
            if (iconSpan && (iconSpan.textContent.trim() === 'shopping_cart' || iconSpan.getAttribute('data-icon') === 'shopping_cart')) {
                const parent = el.parentElement;
                if (parent) {
                    const hasProfile = parent.querySelector('.profile-toggle-btn') ||
                        Array.from(parent.querySelectorAll('.material-symbols-outlined')).some(span => span.textContent.trim() === 'person' || span.getAttribute('data-icon') === 'person');
                    if (!hasProfile && !parent.querySelector('a[href*="/login"]') && !window.location.pathname.includes('/login/')) {
                        const profileBtn = document.createElement('button');
                        profileBtn.className = 'profile-toggle-btn text-primary hover:text-secondary p-1 flex items-center justify-center relative';
                        profileBtn.setAttribute('aria-label', 'Profile');
                        profileBtn.innerHTML = '<span class="material-symbols-outlined">person</span>';
                        parent.insertBefore(profileBtn, el);
                    }
                }
            }
        });

        // 2. Mobile Nav Drawer
        const mobileMenuHtml = `
            <div id="menu-backdrop" class="drawer-backdrop"></div>
            <div id="menu-drawer" class="slide-drawer left-drawer">
                <div class="flex justify-between items-center p-6 border-b-2 border-black">
                    <span class="font-display-lg text-headline-lg-mobile tracking-tighter text-black">PRIME</span>
                    <button id="menu-close" class="text-black hover:text-secondary p-1 flex items-center justify-center">
                        <span class="material-symbols-outlined text-[32px]">close</span>
                    </button>
                </div>
                <nav class="flex flex-col p-6 gap-6 font-headline-lg text-[24px] uppercase">
                    <a class="hover:text-secondary py-2 border-b border-black/10" href="../prime_hydration_official_site/code.html">HOME</a>
                    <a class="hover:text-secondary py-2 border-b border-black/10" href="../shop_all_prime_hydration/code.html">SHOP</a>
                    <a class="hover:text-secondary py-2 border-b border-black/10" href="../about_prime_our_story/code.html">ABOUT PRIME</a>
                    <a class="hover:text-secondary py-2 border-b border-black/10" href="#" id="menu-stores-btn">STORE LOCATOR</a>
                    <a class="hover:text-secondary py-2 border-b border-black/10" href="#" id="menu-verify-btn">VERIFY YOUR PRIME</a>
                </nav>
            </div>
        `;
        body.insertAdjacentHTML('beforeend', mobileMenuHtml);

        // 3. Search Overlay
        const searchHtml = `
            <div id="search-overlay" class="search-overlay flex flex-col items-center">
                <div class="w-full max-w-[1000px] flex flex-col gap-8">
                    <div class="flex justify-between items-center w-full">
                        <h2 class="font-display-lg text-headline-lg-mobile text-black uppercase">SEARCH PRODUCTS</h2>
                        <button id="search-close" class="text-black hover:text-secondary p-2 flex items-center justify-center">
                            <span class="material-symbols-outlined text-[36px]">close</span>
                        </button>
                    </div>
                    <div class="relative w-full border-b-4 border-black">
                        <input type="text" id="search-input" placeholder="START TYPING..." class="w-full text-[32px] md:text-[54px] font-display-xl uppercase bg-transparent border-none text-black focus:ring-0 p-2 placeholder-black/20" />
                    </div>
                    <div id="search-results" class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                        <!-- Dynamic search results -->
                    </div>
                </div>
            </div>
        `;
        body.insertAdjacentHTML('beforeend', searchHtml);

        // 4. Accessibility Control Panel
        const accessPanelHtml = `
            <div id="accessibility-panel" class="access-panel shadow-2xl flex flex-col gap-4 font-label-bold">
                <div class="flex justify-between items-center border-b border-black pb-2">
                    <span class="uppercase text-black font-bold">Accessibility Controls</span>
                    <button id="access-close" class="text-black hover:text-secondary">
                        <span class="material-symbols-outlined text-[18px]">close</span>
                    </button>
                </div>
                <div class="flex flex-col gap-3">
                    <button id="toggle-dark-mode" class="border border-black text-black px-4 py-2 hover:bg-black hover:text-white uppercase transition-colors text-left text-xs sharp-border flex justify-between">
                        <span>Toggle Dark Mode</span>
                        <span class="material-symbols-outlined text-xs">dark_mode</span>
                    </button>
                    <button id="toggle-high-contrast" class="border border-black text-black px-4 py-2 hover:bg-black hover:text-white uppercase transition-colors text-left text-xs sharp-border flex justify-between">
                        <span>High Contrast Mode</span>
                        <span class="material-symbols-outlined text-xs">contrast</span>
                    </button>
                    <div class="flex flex-col gap-1">
                        <span class="text-[10px] text-on-surface-variant uppercase">Text Size</span>
                        <div class="flex gap-2">
                            <button id="text-decrease" class="border border-black text-black px-3 py-1 flex-1 hover:bg-black hover:text-white sharp-border uppercase text-xs">A-</button>
                            <button id="text-reset" class="border border-black text-black px-3 py-1 flex-1 hover:bg-black hover:text-white sharp-border uppercase text-xs">Reset</button>
                            <button id="text-increase" class="border border-black text-black px-3 py-1 flex-1 hover:bg-black hover:text-white sharp-border uppercase text-xs">A+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        body.insertAdjacentHTML('beforeend', accessPanelHtml);

        // Inject accessibility toggle floating button if not present
        if (!document.querySelector('.material-symbols-outlined[style*="accessibility_new"]') &&
            !document.querySelector('button span[class*="accessibility_new"]') &&
            !document.getElementById('access-floating-btn')) {
            const floatingBtn = `
                <div id="access-floating-btn" class="fixed bottom-[20px] left-[20px] z-50">
                    <button class="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform" aria-label="Accessibility settings">
                        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">accessibility_new</span>
                    </button>
                </div>
            `;
            body.insertAdjacentHTML('beforeend', floatingBtn);
        }

        // 5. Toast Notification container
        const toastHtml = `<div id="toast-notify" class="toast-notification">ITEM ADDED TO CART</div>`;
        body.insertAdjacentHTML('beforeend', toastHtml);

        // 6. Generic Info Modal Dialog (Newsletter/Locator/Verify)
        const modalHtml = `
            <div id="info-modal" class="custom-modal">
                <div class="bg-white border-2 border-black p-8 max-w-[500px] w-full mx-4 relative font-body-lg">
                    <button id="info-modal-close" class="absolute top-4 right-4 text-black hover:text-secondary">
                        <span class="material-symbols-outlined text-[28px]">close</span>
                    </button>
                    <div id="info-modal-content" class="flex flex-col gap-6 text-black">
                        <!-- Dynamic modal content goes here -->
                    </div>
                </div>
            </div>
        `;
        body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // ----------------------------------------------------
    // 5. Setup Action Handlers & Event Listeners
    // ----------------------------------------------------
    function setupGlobalEventListeners() {
        // "Learn More" product links require login before viewing/purchasing
        document.addEventListener('click', (e) => {
            const learnMoreBtn = e.target.closest('.product-learn-more');
            if (!learnMoreBtn) return;
            e.preventDefault();
            requireLoginOrPrompt();
        });

        // Cart Toggle buttons (Header cart icons)
        document.querySelectorAll('header button, header a').forEach(el => {
            const iconSpan = el.querySelector('.material-symbols-outlined');
            if (iconSpan && (iconSpan.textContent.trim() === 'shopping_cart' || iconSpan.getAttribute('data-icon') === 'shopping_cart')) {
                // Remove standard href or override action
                if (el.tagName === 'A') {
                    el.addEventListener('click', (e) => { e.preventDefault(); openCartDrawer(); });
                } else {
                    el.addEventListener('click', openCartDrawer);
                }
            }
        });

        // Add support for "BUY PRIME" buttons in header
        document.querySelectorAll('header button, header a').forEach(el => {
            if (el.textContent.trim().toUpperCase() === 'BUY PRIME') {
                if (el.tagName === 'A') {
                    el.addEventListener('click', (e) => { e.preventDefault(); openCartDrawer(); });
                } else {
                    el.addEventListener('click', openCartDrawer);
                }
            }
        });

        // Search Trigger (Header search icons)
        document.querySelectorAll('header button, header a').forEach(el => {
            const iconSpan = el.querySelector('.material-symbols-outlined');
            if (iconSpan && (iconSpan.textContent.trim() === 'search' || iconSpan.getAttribute('data-icon') === 'search')) {
                if (el.tagName === 'A') {
                    el.addEventListener('click', (e) => { e.preventDefault(); openSearchOverlay(); });
                } else {
                    el.addEventListener('click', openSearchOverlay);
                }
            }
        });

        // Mobile Menu hamburger trigger
        document.querySelectorAll('header button').forEach(el => {
            const iconSpan = el.querySelector('.material-symbols-outlined');
            if (iconSpan && iconSpan.textContent.trim() === 'menu') {
                el.addEventListener('click', openMenuDrawer);
            }
        });

        // Close drawer handlers
        document.getElementById('cart-close').addEventListener('click', closeCartDrawer);
        document.getElementById('cart-backdrop').addEventListener('click', closeCartDrawer);
        document.getElementById('menu-close').addEventListener('click', closeMenuDrawer);
        document.getElementById('menu-backdrop').addEventListener('click', closeMenuDrawer);
        document.getElementById('search-close').addEventListener('click', closeSearchOverlay);
        document.getElementById('info-modal-close').addEventListener('click', closeInfoModal);

        // Profile close handlers
        document.getElementById('profile-close').addEventListener('click', closeProfileDrawer);
        document.getElementById('profile-backdrop').addEventListener('click', closeProfileDrawer);

        // Profile toggle buttons click handler
        document.addEventListener('click', (e) => {
            const toggleBtn = e.target.closest('.profile-toggle-btn') ||
                e.target.closest('header button .material-symbols-outlined[data-icon="person"]')?.closest('button') ||
                (e.target.closest('header button') && e.target.closest('header button').querySelector('.material-symbols-outlined')?.textContent.trim() === 'person');
            if (toggleBtn) {
                e.preventDefault();
                handleProfileToggle();
            }
        });

        // Checkout button
        document.getElementById('checkout-btn').addEventListener('click', handleCheckout);

        // Search Input live updates
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (e) => {
            renderSearchResults(e.target.value.trim());
        });

        // Accessibility triggers
        const accessPanel = document.getElementById('accessibility-panel');

        // Find floating button
        const floatingAccessBtn = document.getElementById('access-floating-btn') ||
            document.querySelector('.material-symbols-outlined[style*="accessibility_new"]')?.closest('button') ||
            document.querySelector('button span[class*="accessibility_new"]')?.closest('button');

        if (floatingAccessBtn) {
            floatingAccessBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                accessPanel.classList.toggle('active');
            });
        }

        // Close accessibility panel when clicking close or anywhere else
        document.getElementById('access-close').addEventListener('click', () => {
            accessPanel.classList.remove('active');
        });
        document.addEventListener('click', (e) => {
            if (!accessPanel.contains(e.target) && (!floatingAccessBtn || !floatingAccessBtn.contains(e.target))) {
                accessPanel.classList.remove('active');
            }
        });

        // Accessibility control functions
        document.getElementById('toggle-dark-mode').addEventListener('click', toggleDarkMode);
        document.getElementById('toggle-high-contrast').addEventListener('click', toggleHighContrast);
        document.getElementById('text-increase').addEventListener('click', () => adjustTextSize(1));
        document.getElementById('text-decrease').addEventListener('click', () => adjustTextSize(-1));
        document.getElementById('text-reset').addEventListener('click', () => adjustTextSize(0));

        // Info popup / newsletter signup dynamic modal
        setupNewsletterPopup();

        // Header Language/Location toggles (US / UK)
        setupCountrySelector();
    }

    // ----------------------------------------------------
    // 6. Navigation Link Auto-correction
    // ----------------------------------------------------
    function updateHeaderNavLinks() {
        // Automatically make links point to relative folders
        document.querySelectorAll('header nav a, footer a').forEach(a => {
            const txt = a.textContent.trim().toUpperCase();
            if (txt === 'SHOP') {
                a.href = '../shop_all_prime_hydration/code.html';
                // Active status check
                if (window.location.pathname.includes('shop_all_prime_hydration')) {
                    a.className = "font-label-bold text-label-bold text-primary dark:text-primary-fixed border-b-2 border-primary dark:border-primary-fixed pb-1 uppercase tracking-wider";
                }
            } else if (txt === 'ABOUT PRIME' || txt === 'ABOUT') {
                a.href = '../about_prime_our_story/code.html';
                if (window.location.pathname.includes('about_prime_our_story')) {
                    a.className = "font-label-bold text-label-bold text-primary dark:text-primary-fixed border-b-2 border-primary dark:border-primary-fixed pb-1 uppercase tracking-wider";
                }
            } else if (txt === 'WHERE TO BUY') {
                a.href = '#';
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    closeMenuDrawer();
                    openStoreLocatorModal();
                });
            } else if (txt === 'VERIFY YOUR PRIME') {
                a.href = '#';
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    closeMenuDrawer();
                    openVerificationModal();
                });
            }
        });

        // Link logo to home
        document.querySelectorAll('header .absolute a, header .transform a, footer span.font-display-lg, footer a.font-display-lg').forEach(el => {
            if (el.tagName === 'A') {
                el.href = '../prime_hydration_official_site/code.html';
            }
        });

        // Mobile menu special buttons store locator and verify
        document.getElementById('menu-stores-btn').addEventListener('click', (e) => {
            e.preventDefault();
            closeMenuDrawer();
            openStoreLocatorModal();
        });
        document.getElementById('menu-verify-btn').addEventListener('click', (e) => {
            e.preventDefault();
            closeMenuDrawer();
            openVerificationModal();
        });
    }

    // ----------------------------------------------------
    // 7. Cart Rendering & Interaction
    // ----------------------------------------------------
    function openCartDrawer() {
        document.getElementById('cart-backdrop').classList.add('active');
        document.getElementById('cart-drawer').classList.add('active');
        renderCartItems();
    }

    function closeCartDrawer() {
        document.getElementById('cart-backdrop').classList.remove('active');
        document.getElementById('cart-drawer').classList.remove('active');
    }

    function updateCartBadges() {
        const count = getCartItemCount();
        document.querySelectorAll('header button, header a').forEach(el => {
            const iconSpan = el.querySelector('.material-symbols-outlined');
            if (iconSpan && (iconSpan.textContent.trim() === 'shopping_cart' || iconSpan.getAttribute('data-icon') === 'shopping_cart')) {
                // Check if a badge already exists, if not create one
                let badge = el.querySelector('.cart-badge');
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'cart-badge absolute top-1 right-1 bg-secondary text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center pointer-events-none uppercase';
                    el.style.position = 'relative';
                    el.appendChild(badge);
                }
                badge.textContent = count;
                badge.style.display = count > 0 ? 'flex' : 'none';
            }
        });
    }

    function renderCartItems() {
        const container = document.getElementById('cart-items-container');
        const subtotalEl = document.getElementById('cart-subtotal-val');

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-center py-12">
                    <span class="material-symbols-outlined text-[64px] text-outline mb-4">shopping_cart</span>
                    <p class="font-title-md text-title-md text-black uppercase">YOUR CART IS EMPTY</p>
                    <a href="../shop_all_prime_hydration/code.html" class="mt-4 border-2 border-black px-6 py-2 font-label-bold text-label-bold hover:bg-black hover:text-white transition-colors uppercase inline-block sharp-border">SHOP NOW</a>
                </div>
            `;
            subtotalEl.textContent = '$0.00';
            return;
        }

        let html = '';
        cart.forEach(item => {
            html += `
                <div class="flex gap-4 border-b border-black/10 pb-4">
                    <div class="h-20 w-16 bg-surface-container flex items-center justify-center shrink-0 border border-black/10">
                        <img src="${item.imageSrc}" alt="${item.name}" class="h-[90%] w-auto object-contain" />
                    </div>
                    <div class="flex-grow flex flex-col justify-between">
                        <div>
                            <h4 class="font-title-md text-black uppercase leading-tight">${item.name}</h4>
                            <span class="text-xs text-on-surface-variant font-label-bold">$${item.price.toFixed(2)} EACH</span>
                        </div>
                        <div class="flex items-center justify-between mt-2">
                            <div class="flex items-center border border-black h-8">
                                <button class="px-2 h-full hover:bg-surface-container text-black font-bold flex items-center justify-center shrink-0 qty-dec" data-id="${item.id}">-</button>
                                <span class="px-3 text-xs font-bold text-black">${item.quantity}</span>
                                <button class="px-2 h-full hover:bg-surface-container text-black font-bold flex items-center justify-center shrink-0 qty-inc" data-id="${item.id}">+</button>
                            </div>
                            <button class="text-xs text-secondary hover:underline font-label-bold uppercase item-remove" data-id="${item.id}">REMOVE</button>
                        </div>
                    </div>
                    <div class="text-right flex flex-col justify-between">
                        <span class="font-title-md text-black font-bold">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
        subtotalEl.textContent = `$${getCartTotal().toFixed(2)}`;

        // Attach event listeners inside cart
        container.querySelectorAll('.qty-dec').forEach(btn => {
            btn.addEventListener('click', () => updateQuantity(btn.getAttribute('data-id'), -1));
        });
        container.querySelectorAll('.qty-inc').forEach(btn => {
            btn.addEventListener('click', () => updateQuantity(btn.getAttribute('data-id'), 1));
        });
        container.querySelectorAll('.item-remove').forEach(btn => {
            btn.addEventListener('click', () => removeFromCart(btn.getAttribute('data-id')));
        });
    }

    function handleCheckout() {
        if (cart.length === 0) {
            showToast("YOUR CART IS EMPTY!");
            return;
        }

        closeCartDrawer();
        openCheckoutModal();
    }

    function openCheckoutModal() {
        const modalContent = document.getElementById('info-modal-content');
        let orderItemsHtml = '';
        cart.forEach(item => {
            orderItemsHtml += `
                <div class="flex justify-between items-center text-xs font-label-bold uppercase">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `;
        });

        // Try to retrieve email from logged-in user context
        let savedEmail = '';
        try {
            const storedUser = localStorage.getItem('prime_user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                if (user && user.email) {
                    savedEmail = user.email;
                }
            }
        } catch (e) {
            console.error('Error reading email for checkout:', e);
        }

        modalContent.innerHTML = `
            <div class="text-center flex flex-col items-center gap-4">
                <span class="material-symbols-outlined text-[64px] text-secondary">check_circle</span>
                <h2 class="font-headline-lg text-headline-lg-mobile text-black uppercase">CHECKOUT SUCCESS</h2>
                <p class="text-on-surface-variant text-sm">Thank you for your order! Logan and KSI are packing your energy fuel right now.</p>
            </div>
            
            <div class="border-y-2 border-black py-4 flex flex-col gap-2">
                ${orderItemsHtml}
                <div class="flex justify-between font-title-md text-black uppercase pt-2 border-t border-black/10">
                    <span>Total Paid:</span>
                    <span>$${getCartTotal().toFixed(2)}</span>
                </div>
            </div>

            <!-- Email Capture Field -->
            <div class="flex flex-col gap-1 text-left">
                <label for="checkout-email" class="text-[10px] font-bold text-black uppercase">Email Address (for order receipt)</label>
                <input type="email" id="checkout-email" placeholder="ENTER YOUR EMAIL ADDRESS" class="border-2 border-black h-10 text-black font-label-bold text-xs bg-transparent focus:ring-0 uppercase px-3 placeholder-black/30 sharp-border" required value="${savedEmail}" />
            </div>

            <button id="checkout-confirm" class="w-full bg-black text-white hover:bg-secondary h-12 font-title-md text-sm uppercase transition-colors sharp-border">
                CONFIRM & SEND RECEIPT
            </button>
        `;
        openInfoModal();

        const confirmBtn = document.getElementById('checkout-confirm');
        confirmBtn.addEventListener('click', async () => {
            const emailInput = document.getElementById('checkout-email');
            const emailVal = emailInput ? emailInput.value.trim() : '';

            // Simple email validation regex
            if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
                showToast("PLEASE ENTER A VALID EMAIL ADDRESS");
                if (emailInput) emailInput.focus();
                return;
            }

            // Disable button and indicate sending
            confirmBtn.disabled = true;
            confirmBtn.textContent = "SENDING ORDER...";
            confirmBtn.style.opacity = "0.7";

            try {
                // Post cart details to our server
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: emailVal,
                        cart: cart,
                        total: getCartTotal()
                    })
                });

                const data = await response.json();

                if (data.success) {
                    clearCart();
                    closeInfoModal();
                    showToast("ORDER PLACED! CONFIRMATION EMAIL SENT.");
                } else {
                    console.error("Confirmation email failed:", data.message);
                    clearCart();
                    closeInfoModal();
                    // Inform user of order success but email warning
                    showToast(`ORDER SUCCESS! (EMAIL WARNING: ${data.message})`);
                }
            } catch (err) {
                console.error("Checkout email fetch error:", err);
                clearCart();
                closeInfoModal();
                showToast("ORDER PLACED! (COULD NOT SEND RECEIPT)");
            }
        });
    }

    // ----------------------------------------------------
    // 8. Search Logic
    // ----------------------------------------------------
    function openSearchOverlay() {
        document.getElementById('search-overlay').classList.add('active');
        document.getElementById('search-input').value = '';
        document.getElementById('search-input').focus();
        renderSearchResults('');
    }

    function closeSearchOverlay() {
        document.getElementById('search-overlay').classList.remove('active');
    }

    function renderSearchResults(query) {
        const resultsContainer = document.getElementById('search-results');

        let filtered = mockProducts;
        if (query) {
            filtered = mockProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
        }

        if (filtered.length === 0) {
            resultsContainer.innerHTML = `
                <div class="col-span-full text-center py-12 text-on-surface-variant font-label-bold uppercase">
                    NO PRODUCTS FOUND MATCHING "${query.toUpperCase()}"
                </div>
            `;
            return;
        }

        let html = '';
        filtered.forEach(p => {
            html += `
                <div class="flex flex-col items-center text-center p-4 border border-transparent hover:border-black transition-all bg-surface-container-lowest cursor-pointer search-card-item" data-id="${p.id}">
                    <div class="h-36 w-full flex items-center justify-center overflow-hidden mb-2">
                        <img src="${p.imageSrc}" alt="${p.name}" class="h-full w-auto object-contain transition-transform duration-300 hover:scale-105" />
                    </div>
                    <span class="text-[10px] text-secondary font-label-bold uppercase mb-1">${p.category}</span>
                    <h3 class="font-title-md text-sm text-black uppercase leading-tight mb-1 min-h-[36px] flex items-center justify-center">${p.name}</h3>
                    <span class="font-bold text-black mb-3">$${p.price.toFixed(2)}</span>
                    <button class="w-full bg-black text-white hover:bg-secondary py-1 text-xs font-label-bold uppercase search-add-to-cart sharp-border" data-id="${p.id}">ADD TO CART</button>
                </div>
            `;
        });
        resultsContainer.innerHTML = html;

        // Click handler to go to product details or show coming soon
        resultsContainer.querySelectorAll('.search-card-item').forEach(card => {
            const prodId = card.getAttribute('data-id');
            const prodObj = mockProducts.find(p => p.id === prodId);

            // Allow Add to Cart button to stop propagation
            card.querySelector('.search-add-to-cart').addEventListener('click', (e) => {
                e.stopPropagation();
                addToCart(prodObj, 1);
            });

            card.addEventListener('click', () => {
                if (prodObj.url !== '#') {
                    window.location.href = prodObj.url;
                } else {
                    closeSearchOverlay();
                    openProductInfoModal(prodObj);
                }
            });
        });
    }

    function openProductInfoModal(product) {
        const modalContent = document.getElementById('info-modal-content');
        modalContent.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div class="h-64 bg-surface-container flex items-center justify-center p-4 border border-black/10">
                    <img src="${product.imageSrc}" alt="${product.name}" class="h-full w-auto object-contain" />
                </div>
                <div class="flex flex-col gap-4">
                    <div>
                        <span class="text-xs text-secondary font-label-bold uppercase">${product.category}</span>
                        <h2 class="font-headline-lg text-headline-lg-mobile text-black uppercase leading-none mt-1">${product.name}</h2>
                        <p class="font-display-lg text-headline-lg text-black mt-2">$${product.price.toFixed(2)}</p>
                    </div>
                    <p class="text-xs text-on-surface-variant font-body-lg">
                        This premium flavor is currently out of stock or exclusive to select stores. Sign up below or check back soon for the next drop!
                    </p>
                    <div class="flex flex-col gap-2">
                        <button id="modal-add-cart-btn" class="w-full bg-black text-white hover:bg-secondary py-3 font-title-md text-sm uppercase sharp-border">
                            PRE-ORDER NOW
                        </button>
                    </div>
                </div>
            </div>
        `;
        openInfoModal();

        document.getElementById('modal-add-cart-btn').addEventListener('click', () => {
            addToCart(product, 1);
            closeInfoModal();
        });
    }

    // ----------------------------------------------------
    // 9. Mobile Menu Interactions
    // ----------------------------------------------------
    function openProfileDrawer() {
        document.getElementById('profile-backdrop').classList.add('active');
        document.getElementById('profile-drawer').classList.add('active');
        renderProfileInfo();
    }

    function closeProfileDrawer() {
        document.getElementById('profile-backdrop').classList.remove('active');
        document.getElementById('profile-drawer').classList.remove('active');
    }

    function handleProfileToggle() {
        const user = localStorage.getItem('prime_user');
        if (user) {
            openProfileDrawer();
        } else {
            window.location.href = '../login/code.html';
        }
    }

    // Gate used by "Add to Cart" and "Learn More" — guests get a toast + redirect to login.
    function requireLoginOrPrompt() {
        if (localStorage.getItem('prime_user')) return true;
        showToast('LOGIN TO PURCHASE ITEMS', 2000);
        setTimeout(() => {
            window.location.href = '../login/code.html';
        }, 2000);
        return false;
    }

    function renderProfileInfo() {
        const container = document.getElementById('profile-info-container');
        if (!container) return;

        let user = null;
        try {
            const stored = localStorage.getItem('prime_user');
            user = stored ? JSON.parse(stored) : null;
        } catch (e) {
            user = null;
        }

        if (!user) {
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center text-center py-12 gap-4">
                    <span class="material-symbols-outlined text-[64px] text-outline">account_circle</span>
                    <h3 class="font-title-md text-black uppercase">NOT LOGGED IN</h3>
                    <p class="text-xs text-on-surface-variant uppercase">LOG IN TO ACCESS EXCLUSIVE REWARDS AND DROPS.</p>
                    <button id="profile-drawer-login-btn" class="w-full bg-black text-white hover:bg-secondary py-3 font-title-md text-xs uppercase sharp-border">
                        LOG IN
                    </button>
                </div>
            `;
            document.getElementById('profile-drawer-login-btn').addEventListener('click', () => {
                closeProfileDrawer();
                handleProfileToggle();
            });
            return;
        }

        container.innerHTML = `
            <div class="flex flex-col gap-6">
                <!-- Welcome Card -->
                <div class="border-2 border-black p-6 bg-surface-container-low flex flex-col gap-2">
                    <span class="text-[10px] text-secondary font-bold uppercase">Welcome Back, Champ!</span>
                    <h3 class="font-headline-lg text-headline-lg-mobile text-black uppercase leading-none">${user.name || 'MEMBER'}</h3>
                    <p class="text-[11px] text-on-surface-variant font-label-bold uppercase">Email: ${user.email}</p>
                    <p class="text-[11px] text-on-surface-variant font-label-bold uppercase">Member Since: ${user.joined || '06/2026'}</p>
                </div>

                <!-- Order History -->
                <div class="flex flex-col gap-3">
                    <h4 class="font-title-md text-sm text-black uppercase border-b border-black/20 pb-1">ORDER HISTORY</h4>
                    <div class="flex flex-col gap-2">
                        <div class="border border-black/10 p-3 bg-surface-container-lowest flex justify-between items-center text-xs">
                            <div>
                                <p class="font-bold uppercase text-black">Order #PRM-9824</p>
                                <p class="text-[10px] text-on-surface-variant uppercase">June 14, 2026 • Ice Pop 12 Pack</p>
                            </div>
                            <span class="bg-primary text-white text-[9px] px-2 py-1 uppercase font-bold">Shipped</span>
                        </div>
                        <div class="border border-black/10 p-3 bg-surface-container-lowest flex justify-between items-center text-xs">
                            <div>
                                <p class="font-bold uppercase text-black">Order #PRM-8194</p>
                                <p class="text-[10px] text-on-surface-variant uppercase">May 28, 2026 • Variety Pack 15 Pack</p>
                            </div>
                            <span class="bg-surface-tint text-white text-[9px] px-2 py-1 uppercase font-bold">Delivered</span>
                        </div>
                    </div>
                </div>

                <!-- Rewards Block -->
                <div class="border border-black p-4 flex flex-col gap-2 text-xs">
                    <p class="font-bold text-black uppercase">MEMBER PERKS ACTIVATED</p>
                    <ul class="list-disc pl-4 flex flex-col gap-1 text-[11px] text-on-surface-variant uppercase">
                        <li>Free shipping on orders over $50</li>
                        <li>Early access to future drops</li>
                        <li>10% off recurring subscriptions</li>
                    </ul>
                </div>

                <!-- Logout Button -->
                <button id="logout-btn" class="w-full border-2 border-black text-black hover:bg-black hover:text-white py-3 font-title-md text-xs uppercase transition-colors sharp-border mt-4">
                    LOG OUT
                </button>
            </div>
        `;

        document.getElementById('logout-btn').addEventListener('click', handleLogout);
    }

    async function handleLogout() {
        if (typeof window.getSupabaseClient === 'function') {
            try {
                const client = await window.getSupabaseClient();
                if (client) {
                    // Race against a timeout so a stalled network call can't block logout
                    await Promise.race([
                        client.auth.signOut(),
                        new Promise(resolve => setTimeout(resolve, 3000))
                    ]);
                }
            } catch (err) {
                console.warn('Supabase backend signOut failed:', err);
            }
        }
        localStorage.removeItem('prime_user');
        closeProfileDrawer();
        showToast("LOGGED OUT SUCCESSFULLY!");
        setTimeout(() => {
            window.location.href = '../login/code.html';
        }, 1000);
    }

    function openMenuDrawer() {
        document.getElementById('menu-backdrop').classList.add('active');
        document.getElementById('menu-drawer').classList.add('active');
    }

    function closeMenuDrawer() {
        document.getElementById('menu-backdrop').classList.remove('active');
        document.getElementById('menu-drawer').classList.remove('active');
    }

    // ----------------------------------------------------
    // 10. Modals (Store Locator, Verification, Newsletter)
    // ----------------------------------------------------
    function openInfoModal() {
        document.getElementById('info-modal').classList.add('active');
    }

    function closeInfoModal() {
        document.getElementById('info-modal').classList.remove('active');
    }

    function openStoreLocatorModal() {
        const modalContent = document.getElementById('info-modal-content');
        modalContent.innerHTML = `
            <div class="text-center flex flex-col gap-4">
                <span class="material-symbols-outlined text-[64px] text-black">location_on</span>
                <h2 class="font-headline-lg text-headline-lg-mobile text-black uppercase">FIND PRIME NEAR YOU</h2>
                <p class="text-on-surface-variant text-sm">Enter your zip code or address to locate authorized retailers carrying PRIME hydration and energy drinks.</p>
                
                <div class="flex border-2 border-black h-12 mt-2">
                    <input type="text" id="locator-zip" placeholder="ENTER ZIP CODE (E.G. 10001)" class="flex-grow border-none text-black font-label-bold text-sm bg-transparent focus:ring-0 uppercase px-4 placeholder-black/30" />
                    <button id="locator-search-btn" class="bg-black text-white hover:bg-secondary px-6 font-label-bold text-sm uppercase sharp-border">SEARCH</button>
                </div>
                
                <div id="locator-results" class="text-left mt-4 hidden">
                    <h4 class="font-bold text-xs uppercase mb-2">Stores Found (Mock Results):</h4>
                    <div class="flex flex-col gap-3 max-h-[180px] overflow-y-auto pr-2">
                        <div class="border border-black/10 p-3 bg-surface-container-low">
                            <p class="font-bold text-xs uppercase text-black">GNC Athletic Nutrition</p>
                            <p class="text-[11px] text-on-surface-variant uppercase">120 Broadway, New York, NY 10005</p>
                            <span class="text-[10px] text-secondary font-bold uppercase">IN STOCK: ICE POP, BLUE RASPBERRY</span>
                        </div>
                        <div class="border border-black/10 p-3 bg-surface-container-low">
                            <p class="font-bold text-xs uppercase text-black">Walmart Supercenter</p>
                            <p class="text-[11px] text-on-surface-variant uppercase">77 Greenpoint Ave, Brooklyn, NY 11222</p>
                            <span class="text-[10px] text-secondary font-bold uppercase">IN STOCK: ICE POP (ZERO), CHERRY FREEZE</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        openInfoModal();

        const searchBtn = document.getElementById('locator-search-btn');
        searchBtn.addEventListener('click', () => {
            const zip = document.getElementById('locator-zip').value.trim();
            if (!zip) {
                showToast("PLEASE ENTER A ZIP CODE");
                return;
            }
            document.getElementById('locator-results').classList.remove('hidden');
        });
    }

    function openVerificationModal() {
        const modalContent = document.getElementById('info-modal-content');
        modalContent.innerHTML = `
            <div class="text-center flex flex-col gap-4">
                <span class="material-symbols-outlined text-[64px] text-black">verified</span>
                <h2 class="font-headline-lg text-headline-lg-mobile text-black uppercase">VERIFY YOUR BOTTLE</h2>
                <p class="text-on-surface-variant text-sm">Authentic PRIME has unique branding guidelines. Scan the QR code or enter the 12-digit batch code printed on the neck of your bottle.</p>
                
                <div class="flex border-2 border-black h-12 mt-2">
                    <input type="text" id="verify-code" placeholder="BATCH CODE (E.G. PRM-8492-X9)" class="flex-grow border-none text-black font-label-bold text-sm bg-transparent focus:ring-0 uppercase px-4 placeholder-black/30" />
                    <button id="verify-btn" class="bg-black text-white hover:bg-secondary px-6 font-label-bold text-sm uppercase sharp-border">VERIFY</button>
                </div>
                
                <div id="verify-result" class="text-center mt-4 hidden">
                    <div class="border-2 border-secondary p-4 bg-secondary-fixed/20 flex flex-col items-center gap-2">
                        <span class="material-symbols-outlined text-secondary text-[32px]">check_circle</span>
                        <p class="font-bold text-xs uppercase text-black">BATCH VERIFIED AUTHENTIC</p>
                        <p class="text-[10px] text-on-surface-variant uppercase">PRIME HYDRATION BATCH MFG: 04/2026</p>
                    </div>
                </div>
            </div>
        `;
        openInfoModal();

        const verifyBtn = document.getElementById('verify-btn');
        verifyBtn.addEventListener('click', () => {
            const code = document.getElementById('verify-code').value.trim();
            if (!code) {
                showToast("PLEASE ENTER A BATCH CODE");
                return;
            }
            document.getElementById('verify-result').classList.remove('hidden');
        });
    }

    function setupNewsletterPopup() {
        // Bottom right "DON'T MISS OUT" box handler
        const popup = document.querySelector('.fixed.bottom-margin-desktop.right-margin-desktop, .fixed.bottom-8.right-8');
        if (popup) {
            // Find the button inside the popup box
            const closeBtn = popup.querySelector('button');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Stop click from opening newsletter
                    popup.style.display = 'none';
                });
            }

            popup.addEventListener('click', () => {
                openNewsletterModal();
            });
        }
    }

    function openNewsletterModal() {
        const modalContent = document.getElementById('info-modal-content');
        modalContent.innerHTML = `
            <div class="text-center flex flex-col gap-4">
                <span class="material-symbols-outlined text-[64px] text-black">mail</span>
                <h2 class="font-headline-lg text-headline-lg-mobile text-black uppercase">JOIN THE MOVEMENT</h2>
                <p class="text-on-surface-variant text-sm">Subscribe to receive first updates on limited drops, exclusive flavors, merch releases, and 10% off your first order!</p>
                
                <div class="flex flex-col gap-2 mt-2">
                    <input type="email" id="newsletter-email" placeholder="ENTER EMAIL ADDRESS" class="border-2 border-black h-12 text-black font-label-bold text-sm bg-transparent focus:ring-0 uppercase px-4 placeholder-black/30 sharp-border" />
                    <button id="newsletter-submit-btn" class="bg-black text-white hover:bg-secondary h-12 font-title-md text-sm uppercase sharp-border">SUBSCRIBE</button>
                </div>
            </div>
        `;
        openInfoModal();

        const submitBtn = document.getElementById('newsletter-submit-btn');
        submitBtn.addEventListener('click', () => {
            const email = document.getElementById('newsletter-email').value.trim();
            if (!email || !email.includes('@')) {
                showToast("PLEASE ENTER A VALID EMAIL");
                return;
            }

            modalContent.innerHTML = `
                <div class="text-center flex flex-col items-center gap-4 py-6">
                    <span class="material-symbols-outlined text-[64px] text-secondary">mark_email_read</span>
                    <h2 class="font-headline-lg text-headline-lg-mobile text-black uppercase">YOU'RE ON THE LIST</h2>
                    <p class="text-on-surface-variant text-sm">Check your inbox for confirmation. Here is your code for 10% off:</p>
                    <div class="border-2 border-dashed border-black px-6 py-3 bg-surface-container font-headline-lg text-[24px] tracking-wider text-black select-all">
                        HYDRATE10
                    </div>
                </div>
            `;
            showToast("SUBSCRIBED SUCCESSFULLY!");
        });
    }

    // ----------------------------------------------------
    // 11. Toast Notifications Utility
    // ----------------------------------------------------
    function showToast(message, duration = 3000) {
        const toast = document.getElementById('toast-notify');
        toast.textContent = message;
        toast.classList.add('active');

        setTimeout(() => {
            toast.classList.remove('active');
        }, duration);
    }

    // ----------------------------------------------------
    // 12. Accessibility Controls Actions
    // ----------------------------------------------------
    let currentTextSizeMultiplier = 1;

    function checkAccessibilityPreferences() {
        if (localStorage.getItem('accessibility-dark-mode') === 'true') {
            document.documentElement.classList.add('dark');
        }
        if (localStorage.getItem('accessibility-high-contrast') === 'true') {
            document.documentElement.classList.add('high-contrast');
        }
        const savedMultiplier = parseFloat(localStorage.getItem('accessibility-text-multiplier'));
        if (savedMultiplier && savedMultiplier !== 1) {
            currentTextSizeMultiplier = savedMultiplier;
            applyTextSize();
        }
    }

    function toggleDarkMode() {
        const active = document.documentElement.classList.toggle('dark');
        localStorage.setItem('accessibility-dark-mode', active);
        showToast(active ? "DARK MODE ENABLED" : "DARK MODE DISABLED");
    }

    function toggleHighContrast() {
        const active = document.documentElement.classList.toggle('high-contrast');
        localStorage.setItem('accessibility-high-contrast', active);
        showToast(active ? "HIGH CONTRAST ENABLED" : "HIGH CONTRAST DISABLED");
    }

    function adjustTextSize(direction) {
        if (direction === 0) {
            currentTextSizeMultiplier = 1;
        } else {
            currentTextSizeMultiplier += direction * 0.1;
            // Bound multiplier
            if (currentTextSizeMultiplier < 0.8) currentTextSizeMultiplier = 0.8;
            if (currentTextSizeMultiplier > 1.5) currentTextSizeMultiplier = 1.5;
        }
        localStorage.setItem('accessibility-text-multiplier', currentTextSizeMultiplier);
        applyTextSize();
        showToast(`FONT SIZE: ${Math.round(currentTextSizeMultiplier * 100)}%`);
    }

    function applyTextSize() {
        document.documentElement.style.fontSize = `${currentTextSizeMultiplier * 100}%`;
    }

    // ----------------------------------------------------
    // 13. Header Country/Currency Selector
    // ----------------------------------------------------
    function setupCountrySelector() {
        const selectors = document.querySelectorAll('header div.font-label-bold button, header div.font-label-bold a');

        // Find US / UK buttons
        let usBtn, ukBtn;
        selectors.forEach(el => {
            const txt = el.textContent.trim().toUpperCase();
            if (txt === 'US') usBtn = el;
            if (txt === 'UK') ukBtn = el;
        });

        // Alternate selector format check: a border wrapper containing text "US | UK"
        if (!usBtn || !ukBtn) {
            // Check in secondary border div
            const borderDiv = document.querySelector('header div.border-primary, header div.border');
            if (borderDiv) {
                const innerBtns = borderDiv.querySelectorAll('button');
                if (innerBtns.length >= 2) {
                    usBtn = innerBtns[0];
                    ukBtn = innerBtns[1];
                }
            }
        }

        if (usBtn && ukBtn) {
            const activateBtn = (active, inactive) => {
                active.className = "border border-primary px-3 py-1 bg-primary text-on-primary hover:bg-primary hover:text-on-primary transition-colors duration-100 font-bold sharp-border";
                inactive.className = "px-3 py-1 text-on-surface-variant hover:text-primary transition-colors duration-100 font-normal";
            };

            const savedCountry = localStorage.getItem('prime_country') || 'US';
            if (savedCountry === 'UK') {
                activateBtn(ukBtn, usBtn);
            } else {
                activateBtn(usBtn, ukBtn);
            }

            usBtn.addEventListener('click', () => {
                localStorage.setItem('prime_country', 'US');
                activateBtn(usBtn, ukBtn);
                showToast("REGION SET TO UNITED STATES");
                // Optional: Recalculate prices if currencies change (we can keep USD for simplicity)
            });

            ukBtn.addEventListener('click', () => {
                localStorage.setItem('prime_country', 'UK');
                activateBtn(ukBtn, usBtn);
                showToast("REGION SET TO UNITED KINGDOM (£)");
            });
        }
    }

    // ----------------------------------------------------
    // 14. Page-Specific Dynamic Integrations
    // ----------------------------------------------------
    function setupPageSpecificFeatures() {
        const path = window.location.pathname;

        // --- HOMEPAGE ACTIONS ---
        if (path.includes('prime_hydration_official_site')) {
            // Setup home product cards to buy or navigate
            const products = document.querySelectorAll('main section.px-margin-mobile > div > div');
            products.forEach((prodEl, index) => {
                const titleEl = prodEl.querySelector('h3');
                const btnEl = prodEl.querySelector('button');

                if (titleEl && btnEl) {
                    const titleText = titleEl.textContent.trim().toUpperCase();
                    // Map index to mock product object
                    let mappedProduct = mockProducts[index] || mockProducts[0];

                    // "LEARN MORE" button hooks
                    btnEl.addEventListener('click', (e) => {
                        e.preventDefault();
                        if (mappedProduct.url !== '#') {
                            window.location.href = mappedProduct.url;
                        } else {
                            openProductInfoModal(mappedProduct);
                        }
                    });

                    // Add dynamic quick-add-to-cart link on image hover or container
                    const imgContainer = prodEl.querySelector('.bg-surface-bright');
                    if (imgContainer) {
                        imgContainer.style.position = 'relative';
                        const quickAddHtml = `
                            <button class="absolute bottom-2 right-2 bg-black text-white hover:bg-secondary h-10 w-10 flex items-center justify-center sharp-border opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30" title="Quick Add to Cart">
                                <span class="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                            </button>
                        `;
                        imgContainer.insertAdjacentHTML('beforeend', quickAddHtml);
                        imgContainer.querySelector('button').addEventListener('click', (e) => {
                            e.stopPropagation();
                            addToCart(mappedProduct, 1);
                        });
                    }
                }
            });
        }

        // --- SHOP ACTIONS ---
        if (path.includes('shop_all_prime_hydration')) {
            // Hook up add to cart buttons in the grid
            const cards = document.querySelectorAll('main div.grid > div');

            // Re-render filtering capabilities
            setupShopFilters(cards);
        }

        // --- PRODUCT DETAILS (ICE POP) ---
        if (path.includes('prime_hydration_ice_pop')) {
            setupIcePopProductPage();
        }
    }

    // --- SHOP FILTERS AND SORTING ---
    function setupShopFilters(cards) {
        const container = document.querySelector('main div.grid');
        if (!container) return;

        // Read initial state of cards
        const productsList = [];
        cards.forEach((card, index) => {
            const titleEl = card.querySelector('h3');
            const priceEl = card.querySelector('p');
            const btnEl = card.querySelector('button');
            const imgEl = card.querySelector('img');

            if (titleEl && priceEl && btnEl) {
                const titleText = titleEl.textContent.trim();
                const priceText = priceEl.textContent.trim();
                // Parse price (e.g. "$29.99 / 12 Pack" -> 29.99)
                const priceMatch = priceText.match(/\$?([0-9.]+)/);
                const priceVal = priceMatch ? parseFloat(priceMatch[1]) : 29.99;

                // Determine mockProduct
                let prodObj = mockProducts.find(p => p.name.toUpperCase() === titleText.toUpperCase());
                if (!prodObj) {
                    prodObj = {
                        id: titleText.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                        name: titleText,
                        price: priceVal,
                        imageSrc: imgEl ? imgEl.src : '',
                        url: '#',
                        category: titleText.includes('Zero') ? 'Hydration Drink' : (titleText.includes('Mix') || titleText.includes('Pack') ? 'Variety Packs' : 'Hydration Drink')
                    };
                }

                productsList.push({
                    element: card,
                    data: prodObj
                });

                // Set detail link on image container
                const imgContainer = card.querySelector('.bg-surface-container-low');
                if (imgContainer) {
                    imgContainer.addEventListener('click', () => {
                        if (prodObj.url !== '#') {
                            window.location.href = prodObj.url;
                        } else {
                            openProductInfoModal(prodObj);
                        }
                    });
                }

                // Add to cart button trigger
                btnEl.addEventListener('click', (e) => {
                    e.preventDefault();
                    addToCart(prodObj, 1);
                });
            }
        });

        // Hook up category tab filtering
        const tabs = document.querySelectorAll('main div.flex-wrap button');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Set active styling
                tabs.forEach(t => {
                    t.className = "border border-outline px-6 py-3 font-label-bold text-label-bold text-on-surface-variant hover:bg-surface-variant transition-colors uppercase sharp-border";
                });
                tab.className = "border-2 border-primary bg-primary text-on-primary px-6 py-3 font-label-bold text-label-bold uppercase sharp-border";

                const category = tab.textContent.trim().toUpperCase();
                productsList.forEach(item => {
                    if (category === 'ALL PRODUCTS') {
                        item.element.style.display = 'flex';
                    } else if (category === 'HYDRATION DRINK' && item.data.category === 'Hydration Drink') {
                        item.element.style.display = 'flex';
                    } else if (category === 'ENERGY DRINK' && item.data.category === 'Energy Drink') {
                        item.element.style.display = 'flex';
                    } else if (category === 'VARIETY PACKS' && item.data.category === 'Variety Packs') {
                        item.element.style.display = 'flex';
                    } else {
                        item.element.style.display = 'none';
                    }
                });
            });
        });

        // Hook up sorting
        const sortSelect = document.querySelector('main select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                const sortType = e.target.value;
                let sortedList = [...productsList];

                if (sortType.includes('Low to High')) {
                    sortedList.sort((a, b) => a.data.price - b.data.price);
                } else if (sortType.includes('High to Low')) {
                    sortedList.sort((a, b) => b.data.price - a.data.price);
                } else {
                    // "Featured" sorting, just use original indices
                    // We don't need sorting logic if it matches original
                }

                // Clear and re-append in sorted order
                container.innerHTML = '';
                sortedList.forEach(item => {
                    container.appendChild(item.element);
                });
            });
        }
    }

    // --- ICE POP DETAILS PAGE ---
    function setupIcePopProductPage() {
        const icePopObj = mockProducts.find(p => p.id === 'ice-pop');

        // Quantity selector
        const qtyContainer = document.querySelector('main .qty-selector, main div.flex.items-center.border-2.border-primary');
        const qtyInput = qtyContainer ? qtyContainer.querySelector('input') : null;
        const decBtn = qtyContainer ? qtyContainer.querySelector('button[aria-label="Decrease quantity"], button:first-child') : null;
        const incBtn = qtyContainer ? qtyContainer.querySelector('button[aria-label="Increase quantity"], button:last-child') : null;

        if (qtyInput && decBtn && incBtn) {
            decBtn.addEventListener('click', () => {
                let val = parseInt(qtyInput.value) || 1;
                if (val > 1) {
                    qtyInput.value = val - 1;
                }
            });
            incBtn.addEventListener('click', () => {
                let val = parseInt(qtyInput.value) || 1;
                qtyInput.value = val + 1;
            });
        }

        // Add to cart buttons
        const addCartBtn = document.querySelector('main button.flex-grow.bg-primary');
        if (addCartBtn) {
            addCartBtn.addEventListener('click', () => {
                const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
                addToCart(icePopObj, qty);
            });
        }

        // Subscribe & Save button
        const subSaveBtn = document.querySelector('main button.border.border-primary.text-primary.font-label-bold');
        if (subSaveBtn) {
            subSaveBtn.addEventListener('click', () => {
                addToCart(icePopObj, 1);
                showToast("SUBSCRIBED & SAVED 10%!");
            });
        }

        // Review Form submission
        setupReviewSubmission();
    }

    function setupReviewSubmission() {
        const writeReviewBtn = document.querySelector('main button.border-2.border-primary.px-8.py-3');
        if (!writeReviewBtn) return;

        writeReviewBtn.addEventListener('click', () => {
            const modalContent = document.getElementById('info-modal-content');
            modalContent.innerHTML = `
                <div class="flex flex-col gap-4">
                    <h2 class="font-headline-lg text-headline-lg-mobile text-black uppercase">WRITE A REVIEW</h2>
                    <p class="text-xs text-on-surface-variant uppercase font-bold">Share your experience with Ice Pop Hydration</p>
                    
                    <div class="flex flex-col gap-3">
                        <div class="flex flex-col gap-1">
                            <label class="text-[11px] uppercase font-bold text-black">Your Name</label>
                            <input type="text" id="review-name" placeholder="E.G. JANE D." class="border border-black h-10 px-3 text-black font-label-bold uppercase sharp-border focus:ring-0 placeholder-black/30 text-xs" required />
                        </div>
                        
                        <div class="flex flex-col gap-1">
                            <label class="text-[11px] uppercase font-bold text-black">Rating</label>
                            <div class="flex text-secondary gap-1" id="review-rating-select">
                                <span class="material-symbols-outlined cursor-pointer hover:scale-110 select-star" data-rating="1">star</span>
                                <span class="material-symbols-outlined cursor-pointer hover:scale-110 select-star" data-rating="2">star</span>
                                <span class="material-symbols-outlined cursor-pointer hover:scale-110 select-star" data-rating="3">star</span>
                                <span class="material-symbols-outlined cursor-pointer hover:scale-110 select-star" data-rating="4">star</span>
                                <span class="material-symbols-outlined cursor-pointer hover:scale-110 select-star" data-rating="5">star</span>
                            </div>
                        </div>

                        <div class="flex flex-col gap-1">
                            <label class="text-[11px] uppercase font-bold text-black">Review Title</label>
                            <input type="text" id="review-title" placeholder="E.G. AMAZING TASTE!" class="border border-black h-10 px-3 text-black font-label-bold uppercase sharp-border focus:ring-0 placeholder-black/30 text-xs" required />
                        </div>

                        <div class="flex flex-col gap-1">
                            <label class="text-[11px] uppercase font-bold text-black">Review Content</label>
                            <textarea id="review-body" rows="3" placeholder="WRITE YOUR REVIEW HERE..." class="border border-black p-3 text-black font-label-bold uppercase sharp-border focus:ring-0 placeholder-black/30 text-xs" required></textarea>
                        </div>

                        <button id="review-submit-btn" class="w-full bg-black text-white hover:bg-secondary py-3 font-title-md text-sm uppercase sharp-border mt-2">
                            SUBMIT REVIEW
                        </button>
                    </div>
                </div>
            `;
            openInfoModal();

            // Setup star rating selection logic
            let currentRating = 5;
            const stars = document.getElementById('review-rating-select').querySelectorAll('.select-star');

            const updateStarsUI = (val) => {
                stars.forEach(s => {
                    const rating = parseInt(s.getAttribute('data-rating'));
                    if (rating <= val) {
                        s.classList.add('filled');
                        s.style.fontVariationSettings = "'FILL' 1";
                    } else {
                        s.classList.remove('filled');
                        s.style.fontVariationSettings = "'FILL' 0";
                    }
                });
            };

            // Set default stars (5 filled)
            updateStarsUI(currentRating);

            stars.forEach(s => {
                s.addEventListener('click', () => {
                    currentRating = parseInt(s.getAttribute('data-rating'));
                    updateStarsUI(currentRating);
                });
            });

            // Submit Review logic
            const submitReviewBtn = document.getElementById('review-submit-btn');
            submitReviewBtn.addEventListener('click', () => {
                const name = document.getElementById('review-name').value.trim();
                const title = document.getElementById('review-title').value.trim();
                const body = document.getElementById('review-body').value.trim();

                if (!name || !title || !body) {
                    showToast("PLEASE FILL IN ALL FIELDS");
                    return;
                }

                // Add to page reviews list
                addReviewToPage(name, currentRating, title, body);
                closeInfoModal();
                showToast("REVIEW SUBMITTED! THANK YOU!");
            });
        });
    }

    function addReviewToPage(name, rating, title, content) {
        const reviewsGrid = document.querySelector('main section.border-t-2.border-primary div.grid');
        if (!reviewsGrid) return;

        // Format stars html
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsHtml += '<span class="material-symbols-outlined filled text-[18px]">star</span>';
            } else {
                starsHtml += '<span class="material-symbols-outlined text-[18px]">star</span>';
            }
        }

        const reviewCard = document.createElement('div');
        reviewCard.className = 'bg-surface-container p-stack-lg border border-outline-variant flex flex-col gap-stack-md';
        reviewCard.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex text-primary text-sm">
                    ${starsHtml}
                </div>
                <span class="font-label-bold text-xs text-on-surface-variant uppercase">JUST NOW</span>
            </div>
            <h3 class="font-title-md text-title-md text-primary uppercase">${title}</h3>
            <p class="font-body-lg text-body-lg text-on-surface-variant">${content}</p>
            <p class="font-label-bold text-label-bold uppercase tracking-wider mt-auto pt-stack-sm border-t border-outline-variant text-primary">— ${name} (VERIFIED BUYER)</p>
        `;

        // Prepend to show first
        reviewsGrid.insertBefore(reviewCard, reviewsGrid.firstChild);

        // Update overall reviews count stat
        const reviewsStat = document.querySelector('main section.border-t-2.border-primary div.font-label-bold');
        if (reviewsStat) {
            // E.g. "4.8 / 5.0 (1,284 REVIEWS)"
            const txt = reviewsStat.textContent;
            const countMatch = txt.match(/\(([,0-9]+)\sREVIEWS\)/);
            if (countMatch) {
                const count = parseInt(countMatch[1].replace(/,/g, '')) + 1;
                reviewsStat.textContent = `4.8 / 5.0 (${count.toLocaleString()} REVIEWS)`;
            }
        }
    }

    // Expose showToast globally for other scripts (e.g. login/signup auth errors)
    window.showToast = showToast;
})();
