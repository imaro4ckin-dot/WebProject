// Inject the vote UI into the page
function injectVoteHTML() {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="flex items-center gap-6 mt-10 pt-6 border-t border-gray-200">
      <p class="font-bold text-gray-700 text-lg">Was this post helpful?</p>
      <button id="likeBtn" onclick="handleVote('like')"
        class="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-800 font-bold py-2 px-5 rounded-full transition-colors">
        👍 Like
      </button>
      <button id="dislikeBtn" onclick="handleVote('dislike')"
        class="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-800 font-bold py-2 px-5 rounded-full transition-colors">
        👎 Dislike
      </button>
    </div>
    <div id="voteResults" class="hidden mt-4 space-y-2 text-sm text-gray-700">
      <div class="flex items-center gap-3">
        <span class="w-16 text-right font-bold text-green-700" id="likePct">0%</span>
        <div class="flex-1 bg-gray-200 rounded-full h-4">
          <div id="likeBar" class="bg-green-500 h-4 rounded-full transition-all duration-500" style="width:0%"></div>
        </div>
        <span class="w-10 text-gray-500" id="likeCount">(0)</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="w-16 text-right font-bold text-red-700" id="dislikePct">0%</span>
        <div class="flex-1 bg-gray-200 rounded-full h-4">
          <div id="dislikeBar" class="bg-red-400 h-4 rounded-full transition-all duration-500" style="width:0%"></div>
        </div>
        <span class="w-10 text-gray-500" id="dislikeCount">(0)</span>
      </div>
      <p id="votedMsg" class="hidden text-blue-700 font-semibold mt-1">✅ Thanks for your feedback!</p>
    </div>
  `;

  // Append it to the end of the <article> tag
  const article = document.querySelector('article');
  if (article) article.appendChild(container);
}

function loadVotes() {
  return JSON.parse(localStorage.getItem(POST_KEY) || '{"likes":0,"dislikes":0}');
}

function updateUI(votes) {
  const total = votes.likes + votes.dislikes;
  const likePct = total ? Math.round((votes.likes / total) * 100) : 0;
  const dislikePct = total ? 100 - likePct : 0;

  document.getElementById('likePct').textContent      = likePct + '%';
  document.getElementById('dislikePct').textContent   = dislikePct + '%';
  document.getElementById('likeBar').style.width      = likePct + '%';
  document.getElementById('dislikeBar').style.width   = dislikePct + '%';
  document.getElementById('likeCount').textContent    = '(' + votes.likes + ')';
  document.getElementById('dislikeCount').textContent = '(' + votes.dislikes + ')';
  document.getElementById('voteResults').classList.remove('hidden');
}

function handleVote(type) {
  const alreadyVoted = localStorage.getItem(POST_KEY + "_voted");
  const votes = loadVotes();

//   The code below has been commented to allow a person to vote twice!!! 
  if (!alreadyVoted) {
    if (type === 'like') votes.likes++;
    else votes.dislikes++;
    localStorage.setItem(POST_KEY, JSON.stringify(votes));
    localStorage.setItem(POST_KEY + "_voted", "true");
    document.getElementById('votedMsg').classList.remove('hidden');
    document.getElementById('likeBtn').disabled = true;
    document.getElementById('dislikeBtn').disabled = true;
    document.getElementById('likeBtn').classList.add('opacity-50', 'cursor-not-allowed');
    document.getElementById('dislikeBtn').classList.add('opacity-50', 'cursor-not-allowed');
  }
  updateUI(votes);
}

document.addEventListener('DOMContentLoaded', () => {
  injectVoteHTML();

  const votes = loadVotes();
  const alreadyVoted = localStorage.getItem(POST_KEY + "_voted");
  if (alreadyVoted || (votes.likes + votes.dislikes > 0)) {
    updateUI(votes);
    if (alreadyVoted) {
      document.getElementById('votedMsg').classList.remove('hidden');
      document.getElementById('likeBtn').disabled = true;
      document.getElementById('dislikeBtn').disabled = true;
      document.getElementById('likeBtn').classList.add('opacity-50', 'cursor-not-allowed');
      document.getElementById('dislikeBtn').classList.add('opacity-50', 'cursor-not-allowed');
    }
  }
});