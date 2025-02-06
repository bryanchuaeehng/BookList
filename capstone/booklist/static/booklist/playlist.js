document.addEventListener('DOMContentLoaded', ()=> {
    var bground_to_hide_top = document.querySelector('#bground_to_hide_top');
    var div_for_backdrop_blur = document.querySelector('#div_for_backdrop_blur');
    var height50 = div_for_backdrop_blur.style.height;
    var lastScrolled = 0;
    document.querySelectorAll(".delete_btns").forEach(btn => {
        btn.addEventListener('click', ()=> {
            book_id = btn.dataset.bookid;
            playlist_id = btn.dataset.playlistid;
            fetch(`/remove_from_playlist/${book_id}/${playlist_id}`, {
                method: 'POST'
            })
            .then(response => response.json())
            .then(result => {
                if (result.error) {
                    alert(result.error);
                } else {
                    var to_rem = document.querySelector(`#book_no_${book_id}`);
                    to_rem.style.animationPlayState = 'running';
                    to_rem.addEventListener('animationend', ()=> {
                        to_rem.remove();
                        if (document.querySelector('main').innerHTML.trim() == "") {
                            document.querySelector('main').innerHTML = '<div style="display: grid; width: 100%; height: 100%; place-items: center; text-align: center;">This playlist is empty.</div>';
                        }
                    });
                    
                }
            });
        });
    });

    document.querySelectorAll('.read_more_btns').forEach(rm_btn => {
        rm_btn.addEventListener('click', (event)=> {    
            var parent_div = event.target.parentElement.parentElement;
            parent_div.firstElementChild.style.display = 'none';
            parent_div.lastElementChild.style.display = 'inline';
        });
    });

    window.addEventListener('wheel', (event) => {
        if (scrollY > height50) {
            bground_to_hide_top.style.height = '24vh';
            div_for_backdrop_blur.style.height = '24vh';
        } else if (scrollY - lastScrolled < 0) {
            bground_to_hide_top.style.height = '50vh';
            div_for_backdrop_blur.style.height = '50vh';
        }
        lastScrolled = scrollY;
    });

    document.querySelector('#back_btn_play').addEventListener('click', ()=> {
        window.history.back();
    });

    document.querySelector('#edit_btn_play').addEventListener('click', ()=> {
        if (document.querySelector('#book_delete').style.display == 'grid') {
            document.querySelectorAll('#book_delete').forEach(item => {
                item.style.display = 'none';
            });
        } else {
            document.querySelectorAll('#book_delete').forEach(item => {
                item.style.display = 'grid';
            });
        }
    });

    // stars for books
    document.querySelectorAll('#book_rating').forEach(div => {
        let r = Number(div.textContent);
        var myHTML = '';
        for (let i=0; i<r; i++)
        {
            myHTML += "<span style='color: #28a745;'>&#9733;</span>";
        }
        for (let i=r; i<5; i++)
        {
            myHTML += "<span style='color: #28a745;'>&#9734;</span>";
        }
        myHTML += ` ${div.textContent}`;
        div.innerHTML = myHTML;
    });
    
});