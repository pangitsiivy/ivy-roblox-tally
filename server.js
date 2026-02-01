const SUPABASE_URL = 'https://avkwuvnshxkhpxfgyrqy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ZcLXk3Eqmu1ramk5sbbQoQ_wKWmaQb-';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchLeaderboard() {
    const { data, error } = await supabaseClient
        .from('leaderboard')
        .select('*')
        // 1. FIXED: Order by 'robux' descending so the highest score is Rank 1
        .order('robux', { ascending: false }); 

    if (error) return console.error(error);

    const container = document.getElementById('leaderboard-list');
    // 2. FIXED: Use 'index + 1' for automatic ranking so you don't see "null"
    container.innerHTML = data.map((player, index) => `
        <div class="bg-[#005fb8] flex items-center p-3 rounded-lg pixel-shadow border border-white/10 mb-4">
            <div class="flex-shrink-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] text-black font-bold mr-3 ring-2 ring-yellow-200">
                ${index + 1}
            </div>
            
            <div class="w-10 h-10 bg-gray-400 rounded-full mr-4 border-2 border-white/20 overflow-hidden flex-shrink-0">
                <img src="${player.photo_url || 'https://api.dicebear.com/7.x/pixel-art/svg?seed=' + player.name}" 
                     alt="avatar" class="w-full h-full object-cover">
            </div>

            <span class="text-white text-[10px] md:text-sm flex-grow truncate uppercase mr-2">${player.name}</span>
            
            <div class="flex items-center bg-[#004a8f] px-3 py-2 rounded-md flex-shrink-0">
                <div class="w-4 h-4 bg-yellow-400 rounded-full mr-2 border-b-2 border-yellow-600"></div>
                <span class="text-white text-[9px] md:text-[10px]">${player.robux} ROBUX</span>
            </div>
        </div>
    `).join('');
}

fetchLeaderboard();

// Realtime sync
supabaseClient
    .channel('any')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboard' }, fetchLeaderboard)
    .subscribe();
