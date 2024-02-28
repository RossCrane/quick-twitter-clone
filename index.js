import { tweetsData } from './data.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function (e) {
	if (e.target.dataset.like) {
		handleLikeClick(e.target.dataset.like);
	} else if (e.target.dataset.retweet) {
		handleRetweetClick(e.target.dataset.retweet);
	} else if (e.target.dataset.reply) {
		handleReplyClick(e.target.dataset.reply);
	} else if (e.target.id === 'tweet-btn') {
		handleTweetBtnClick();
	} else if (e.target.dataset.delete) {
		handleDeleteClick(e.target.dataset.delete);
	}
});

function handleLikeClick(tweetId) {
	const targetTweetObj = tweetsData.filter(function (tweet) {
		return tweet.uuid === tweetId;
	})[0];

	if (targetTweetObj.isLiked) {
		targetTweetObj.likes--;
	} else {
		targetTweetObj.likes++;
	}
	targetTweetObj.isLiked = !targetTweetObj.isLiked;
	render();
}

function handleRetweetClick(tweetId) {
	const targetTweetObj = tweetsData.filter(function (tweet) {
		return tweet.uuid === tweetId;
	})[0];

	if (targetTweetObj.isRetweeted) {
		targetTweetObj.retweets--;
	} else {
		targetTweetObj.retweets++;
	}
	targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
	render();
}

function handleReplyClick(tweetId) {
	let replySection = document.getElementById(`reply-section-${tweetId}`);
	if (!replySection) {
		const replyInput = document.createElement('textarea');
		replyInput.id = `reply-input-${tweetId}`;
		replyInput.placeholder = 'Write a reply...';

		const submitButton = document.createElement('button');
		submitButton.textContent = 'Submit Reply';
		submitButton.onclick = function () {
			const replyText = replyInput.value;
			if (!replyText.trim()) {
				alert('Please enter a reply text.');
				return;
			}
			submitReply(tweetId, replyText);
			replyInput.value = '';
		};

		replySection = document.createElement('div');
		replySection.id = `reply-section-${tweetId}`;
		replySection.appendChild(replyInput);
		replySection.appendChild(submitButton);

		const tweetElement = document.getElementById(`tweet-${tweetId}`);
		if (tweetElement) {
			tweetElement.appendChild(replySection);
		} else {
			console.error('Tweet element not found');
		}
	} else {
		replySection.style.display =
			replySection.style.display === 'none' ? '' : 'none';
	}

	const repliesDiv = document.getElementById(`replies-${tweetId}`);
	if (repliesDiv && repliesDiv.classList.contains('hidden')) {
		repliesDiv.classList.remove('hidden');
	}
}

function submitReply(tweetId, replyText) {
	const tweet = tweetsData.find((tweet) => tweet.uuid === tweetId);
	if (tweet) {
		tweet.replies.push({
			handle: '@YourHandle',
			profilePic: 'images/profile.jpg',
			tweetText: replyText,
		});
		console.log('Replies after adding new one:', tweet.replies);
		render();
	} else {
		console.error('Tweet not found for id:', tweetId);
	}
}

function handleTweetBtnClick() {
	const tweetInput = document.getElementById('tweet-input');

	if (tweetInput.value) {
		tweetsData.unshift({
			handle: `@Scrimba`,
			profilePic: `images/scrimbalogo.png`,
			likes: 0,
			retweets: 0,
			tweetText: tweetInput.value,
			replies: [],
			isLiked: false,
			isRetweeted: false,
			uuid: uuidv4(),
		});
		render();
		tweetInput.value = '';
	}
}

function handleDeleteClick(tweetId) {
	const index = tweetsData.findIndex((tweet) => tweet.uuid === tweetId);
	if (index !== -1) {
		tweetsData.splice(index, 1);
		render();
	}
}

function getFeedHtml() {
	let feedHtml = ``;

	tweetsData.forEach(function (tweet) {
		let likeIconClass = tweet.isLiked ? 'liked' : '';
		let retweetIconClass = tweet.isRetweeted ? 'retweeted' : '';

		let repliesHtml = tweet.replies
			.map(
				(reply) => `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${reply.handle}</p>
            <p class="tweet-text">${reply.tweetText}</p>
        </div>
    </div>
</div>
        `
			)
			.join('');

		feedHtml += `
<div class="tweet" id="tweet-${tweet.uuid}">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                    ${tweet.retweets}
                </span>
                <!-- Delete Button -->
                <span class="tweet-detail">
                    <button class="delete-tweet-btn" data-delete="${tweet.uuid}">Delete</button>
                </span>
            </div>
        </div>
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>
</div>
`;
	});

	return feedHtml;
}

function render() {
	document.getElementById('feed').innerHTML = getFeedHtml();
}

render();
