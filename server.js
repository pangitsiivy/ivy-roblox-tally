const SUPABASE_URL = 'https://avkwuvnshxkhpxfgyrqy.supabase.co';
        const SUPABASE_KEY = 'sb_publishable_ZcLXk3Eqmu1ramk5sbbQoQ_wKWmaQb-';
        const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ... (Your URL and KEY stay the same)

// 1. Rename this to fetchLeaderboard to match your calls below
async function fetchLeaderboard() { 
    const { data, error } = await supabaseClient
        .from('leaderboard')
        .select('*')
        .order('robux', { ascending: false }); // Highest Robux = Rank 1

    if (error) {
        console.error("Error fetching data:", error);
        return;
    }

    const list = document.getElementById('leaderboard-list');
    if (!list) return;

    list.innerHTML = data.map((player, index) => `
        <div class="bg-[#005fb8] flex items-center p-3 rounded-lg shadow-md mb-4">
            <div class="flex-shrink-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold mr-3">
                ${index + 1}
            </div>
            
            <div class="w-10 h-10 rounded-full mr-4 overflow-hidden bg-gray-600">
                <img src="${player.photo_url || 'https://api.dicebear.com/7.x/pixel-art/svg?seed=' + player.name}" class="w-full h-full object-cover">
            </div>

            <span class="text-white flex-grow uppercase font-bold">${player.name}</span>
            
            <div class="flex items-center bg-[#004a8f] px-3 py-2 rounded-md">
                <div class="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                <span class="text-white text-xs">${player.robux} ROBUX</span>
            </div>
        </div>
    `).join('');
}

// 2. This calls it when the page first opens
fetchLeaderboard();

// 3. Realtime sync: This calls it every time the database changes
supabaseClient
    .channel('any')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboard' }, fetchLeaderboard)
    .subscribe();

