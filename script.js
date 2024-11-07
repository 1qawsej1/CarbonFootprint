document.addEventListener("DOMContentLoaded", () => {
    const commentForm = document.getElementById("comment-form");
    const commentInput = document.getElementById("comment-input");
    const usernameInput = document.getElementById("username-input");
    const commentsContainer = document.getElementById("comments-container");

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

        if (!isReply) {
            commentsContainer.appendChild(commentDiv);
        } else {
            const repliesContainer = document.createElement("div");
            repliesContainer.classList.add("replies");
            repliesContainer.appendChild(commentDiv);
            return repliesContainer;
        }

        addReplyForm(commentDiv);
    }

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
            }
        });

        commentDiv.appendChild(replyForm);
    }

    function toggleReplyForm(commentDiv) {
        const replyForm = commentDiv.querySelector(".reply-form");
        replyForm.style.display = replyForm.style.display === "none" || !replyForm.style.display ? "block" : "none";
    }

    function deleteComment(commentDiv) {
        commentDiv.remove();
    }
});
