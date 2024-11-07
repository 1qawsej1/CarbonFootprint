document.addEventListener("DOMContentLoaded", () => {
    const commentForm = document.getElementById("comment-form");
    const commentInput = document.getElementById("comment-input");
    const usernameInput = document.getElementById("username-input");
    const commentsContainer = document.getElementById("comments-container");

    // Load existing comments from localStorage
    loadComments();

    // Event listener for the comment submission form
    commentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        const commentText = commentInput.value.trim();

        if (username && commentText) {
            addComment(username, commentText);
            usernameInput.value = "";
            commentInput.value = "";
        } else {
            alert("Please enter both username and comment.");
        }
    });

    // Function to add a new comment
    function addComment(username, text, isReply = false) {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");

        const content = document.createElement("p");
        content.textContent = `${username}: ${text}`;

        const deleteButton = document.createElement("span");
        deleteButton.classList.add("delete-btn");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            deleteComment(commentDiv);
        });

        const replyButton = document.createElement("span");
        replyButton.classList.add("reply-btn");
        replyButton.textContent = "Reply";
        replyButton.addEventListener("click", () => {
            toggleReplyForm(commentDiv);
        });

        commentDiv.appendChild(content);
        commentDiv.appendChild(replyButton);
        commentDiv.appendChild(deleteButton);

        // If it's not a reply, add it to the main comment section
        if (!isReply) {
            commentsContainer.appendChild(commentDiv);
        } else {
            const repliesContainer = commentDiv.querySelector(".replies") || document.createElement("div");
            repliesContainer.classList.add("replies");
            repliesContainer.appendChild(commentDiv);
            return repliesContainer;
        }

        addReplyForm(commentDiv);
        saveComments();
    }

    // Function to add a reply form to a comment
    function addReplyForm(commentDiv) {
        const replyForm = document.createElement("form");
        replyForm.classList.add("reply-form");

        const replyInput = document.createElement("textarea");
        replyInput.placeholder = "Write a reply...";
        replyInput.required = true;

        const replyButton = document.createElement("button");
        replyButton.type = "submit";
        replyButton.textContent = "Reply";

        replyForm.appendChild(replyInput);
        replyForm.appendChild(replyButton);
        replyForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const replyText = replyInput.value.trim();
            if (replyText) {
                const replyContainer = addComment("Replying", replyText, true);
                commentDiv.querySelector(".replies")?.appendChild(replyContainer);
                replyInput.value = "";
                replyForm.style.display = "none";
                saveComments();
            }
        });

        commentDiv.appendChild(replyForm);
    }

    // Function to toggle the visibility of the reply form
    function toggleReplyForm(commentDiv) {
        const replyForm = commentDiv.querySelector(".reply-form");
        replyForm.style.display = replyForm.style.display === "none" || !replyForm.style.display ? "block" : "none";
    }

    // Function to delete a comment
    function deleteComment(commentDiv) {
        commentDiv.remove();
        saveComments();
    }

    // Function to save comments to localStorage
    function saveComments() {
        const allComments = [];
        const commentDivs = commentsContainer.querySelectorAll('.comment');

        commentDivs.forEach((commentDiv) => {
            const comment = {
                username: commentDiv.querySelector('p').textContent.split(':')[0],
                text: commentDiv.querySelector('p').textContent.split(':')[1].trim(),
                replies: [],
            };

            const repliesContainer = commentDiv.querySelector('.replies');
            if (repliesContainer) {
                const replyDivs = repliesContainer.querySelectorAll('.comment');
                replyDivs.forEach((replyDiv) => {
                    const reply = {
                        username: replyDiv.querySelector('p').textContent.split(':')[0],
                        text: replyDiv.querySelector('p').textContent.split(':')[1].trim(),
                    };
                    comment.replies.push(reply);
                });
            }

            allComments.push(comment);
        });

        localStorage.setItem('comments', JSON.stringify(allComments));
    }

    // Function to load comments from localStorage
    function loadComments() {
        const savedComments = JSON.parse(localStorage.getItem('comments')) || [];
        savedComments.forEach((comment) => {
            addComment(comment.username, comment.text);

            // Add replies if any
            if (comment.replies.length > 0) {
                const commentDiv = commentsContainer.lastChild;
                const repliesContainer = commentDiv.querySelector('.replies') || document.createElement('div');
                repliesContainer.classList.add('replies');
                comment.replies.forEach((reply) => {
                    addComment(reply.username, reply.text, true);
                });
                commentDiv.appendChild(repliesContainer);
            }
        });
    }
});
