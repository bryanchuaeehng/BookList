document.addEventListener("DOMContentLoaded", () => {
    document.querySelector('#option_friends').addEventListener('click', ()=> {
        document.querySelector('#option_friends').style.fontWeight = 'bold';
        document.querySelector('#option_friends').style.textDecoration = 'underline';
        document.querySelector('#option_find').style.fontWeight = 'normal';
        document.querySelector('#option_find').style.textDecoration = 'none';
        document.querySelector('#body_friends').style.display = 'block';
        document.querySelector('#body_find').style.display = 'none';
    });

    document.querySelector('#option_find').addEventListener('click', ()=> {
        document.querySelector('#option_find').style.fontWeight = 'bold';
        document.querySelector('#option_find').style.textDecoration = 'underline';
        document.querySelector('#option_friends').style.fontWeight = 'normal';
        document.querySelector('#option_friends').style.textDecoration = 'none';
        document.querySelector('#body_friends').style.display = 'none';
        document.querySelector('#body_find').style.display = 'block';
    });

    document.querySelector('#back_btn_play').addEventListener('click', ()=> {
        window.history.back();
    });

    document.querySelector('#searchbar').addEventListener('keyup', () => {
        var query = document.querySelector('#searchbar').value;
        if (query.length == 0) {
            document.querySelector('#search_res').innerHTML = `<p style="text-align: center;">Search results will appear here.</p>`;
        } else {
            fetch(`/pf_search`, {
                method: 'POST',
                body: JSON.stringify({
                    query : query
                })
            })
            .then(response=>response.json())
            .then(results => {
                if (results.error) {
                    alert(results.error);
                } else {
                    document.querySelector('#search_res').innerHTML = '';
                    var myHTML = '';
                    for (var i=0; i<results.length; i++)
                    {
                        myHTML += `
                            <div class="profiles_section">
                                <div id="pfp_div">
                                    <img src="${results[i].pfp}" class="pfp_img rounded-circle">
                                </div>
                                <div id="username_div">${results[i].username}</div>
                                <div id="username_div">
                                    <a id="add_friend_a" href="/add_friend/${results[i].id}">+ Add friend</a>
                                </div>
                            </div>
                        `;
                    }
                    if (results.length == 0)
                    {
                        myHTML = `<p style="text-align: center;">No matching results found.</p>`;
                    }
                    document.querySelector('#search_res').innerHTML = myHTML;
                }
            });
        }
    });
});