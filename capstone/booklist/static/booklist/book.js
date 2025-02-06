document.addEventListener('DOMContentLoaded', ()=> {

    let checked_counter = 0;
    // for width of bar
    let current_progress = Number(document.querySelector('#current_page').textContent);
    let total_pages = Number(document.querySelector('#total_pages_of_book').textContent);
    var progress_percent = (current_progress / total_pages) * 100;
    document.querySelector('.progress-bar').style.width = `${progress_percent}%`; 
    if (progress_percent == 100) {
        document.querySelector('.progress-bar').style.backgroundColor = "#28a745";
    }  else {
        document.querySelector('.progress-bar').style.backgroundColor = "#ffc107";
    }

    // populate stars for ratings
    var initial_stars = Number(document.querySelector('#book_rating').innerHTML);
    if (initial_stars <= 5 && initial_stars >= 0)
    {
        var star_div_html = "";
        for (let i=0; i<initial_stars; i++) 
        {
            star_div_html += `<span class="stars_to_click" data-num="${i+1}">&#9733;</span>`;
        }
        for (let i=initial_stars; i<5; i++) 
        {
            star_div_html += `<span class="stars_to_click" data-num="${i+1}">&#9734;</span>`;
        }
        document.querySelector('#star_display_div').innerHTML = star_div_html;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function show_edit() {
        if (document.querySelector('#current_page').style.display == 'none') {    
            document.querySelector('#current_page').style.display = 'inline';
            document.querySelector('#edit_pages_form').style.display = 'none';
        } else { 
            document.querySelector('#current_page').style.display = 'none';
            document.querySelector('#edit_pages_form').style.display = 'inline-flex';
        }
    }

    function show_description() {
        if (document.querySelector('#description').style.display == 'none') {
            document.querySelector('#description').style.display = 'block';
            document.querySelector('#edit_description_form').style.display = 'none'; 
        } else {
            document.querySelector('#description').style.display = 'none';
            document.querySelector('#edit_description_form').style.display = 'block'; 
        }
    }

    function close_popup() {
        document.querySelector('#popup_playlist').style.display = 'none';
    }

    function update_stars_aesthetic(numb) {
        var num = Number(numb);
        var star_div_html = "";
        for (let i=0; i<num; i++) 
        {
            star_div_html += `<span class="stars_to_click" data-num="${i+1}">&#9733;</span>`;
        }
        for (let i=num; i<5; i++) 
        {
            star_div_html += `<span class="stars_to_click" data-num="${i+1}">&#9734;</span>`;
        }
        document.querySelector('#star_display_div').innerHTML = star_div_html;

        document.querySelectorAll(".stars_to_click").forEach(function(star_btn) {
            star_btn.addEventListener('click', (event)=> {
                var num = Number(event.target.dataset.num);
                var id = document.querySelector('#book_id').value;
                if (num >= 0 && num <= 5)
                {
                    fetch(`/rate/${id}/${num}`, {
                        method: 'POST',
                        body: JSON.stringify({
                            new_rating: num
                        })
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.error) {
                            alert(result.error)
                        } else {
                            update_stars_aesthetic(num);
                            document.querySelector('#book_rating').innerHTML = num.toString() + '.0';
                        }
                    })
               }
            });
        });
    }

    document.querySelector('#back_btn_play').addEventListener('click', ()=> {
        window.history.back();
    });

    // toggle hideshow edit pages
    document.querySelector('#edit_button_for_pages').addEventListener('click', ()=> {
        show_edit();
    });
    // toggle hideshow edit description
    document.querySelector('#edit_button_for_description').addEventListener('click', ()=> {
        show_description();
    });


    // submit edit pages
    document.querySelector('#edit_pages_form').addEventListener('submit', (event)=> {
        event.preventDefault();
        var id = document.querySelector('#book_id').value;
        var new_page = document.querySelector('#textarea_current_page').value;
        // fetch to POST the new content
        fetch(`/edit/${id}`, {
            method: 'POST',
            body: JSON.stringify({
                content: new_page,
                edit_for: "page"
                })
        })
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                alert(result.error);
                document.querySelector('#textarea_current_page').innerHTML = document.querySelector('#current_page').innerHTML;
            } else {
                // for the editing interface textarea to update and match the new content
                document.querySelector('#current_page').innerHTML = new_page;
                document.querySelector('#textarea_current_page').innerHTML = new_page;
                // update progress bar as well
                progress_percent = Number(new_page) / total_pages * 100;
                document.querySelector('.progress-bar').style.width = `${progress_percent}%`;
                if (progress_percent == 100) {
                    document.querySelector('.progress-bar').style.backgroundColor = "#28a745";
                } else {
                    document.querySelector('.progress-bar').style.backgroundColor = "#ffc107";
                }
            }
            show_edit();
        });
    });
    // submit edit description
    document.querySelector('#edit_description_form').addEventListener('submit', (event)=> {
        event.preventDefault();
        var id = document.querySelector('#book_id').value;
        var new_description = document.querySelector('#textarea_description').value;
        // fetch to POST the new content
        fetch(`/edit/${id}`, {
            method: 'POST',
            body: JSON.stringify({
                content: new_description,
                edit_for: "description"
                })
        })
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                alert(result.error);
                document.querySelector('#textarea_description').innerHTML = document.querySelector('#description').innerHTML;
            } else {
                // for the editing interface textarea to update and match the new content
                document.querySelector('#description').innerHTML = new_description;
                document.querySelector('#textarea_description').innerHTML = new_description;
            }
            show_description();
        });
    });

    document.querySelectorAll(".stars_to_click").forEach(function(star_btn) {
        star_btn.addEventListener('click', (event)=> {
            var num = Number(event.target.dataset.num);
            var id = document.querySelector('#book_id').value;
            if (num >= 0 && num <= 5)
            {
                fetch(`/rate/${id}/${num}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        new_rating: num
                    })
                })
                .then(response => response.json())
                .then(result => {
                    if (result.error) {
                        alert(result.error)
                    } else {
                        update_stars_aesthetic(num);
                        document.querySelector('#book_rating').innerHTML = num.toString() + '.0';
                    }
                })
            }
        });
    });

    document.querySelector('#add_to_playlist').addEventListener('click', ()=> {
        document.querySelector('#popup_playlist').style.display = 'block';
    });
    
    document.querySelector('#close_popup_btn').addEventListener('click', close_popup);

    // for add to playlist form submission
    document.querySelector('#add_to_playlist_form').addEventListener('submit', function(event) {
        event.preventDefault();
        // start loader
        document.querySelector('#grid_for_loader').style.display = 'grid';

        document.querySelectorAll('.form-check-input').forEach(chkbox => {
            if (chkbox.checked) {
                var playlist_id = chkbox.value;
                var book_id = document.querySelector('#book_id').value;
                fetch(`/add_to_playlist/${book_id}/${playlist_id}`, {
                    method: 'POST'
                });
            }
        });
        // end loader
        sleep(500).then(()=> {
            document.querySelector('#grid_for_loader').style.display = 'none';
            close_popup();
        }); 
    });

    document.querySelectorAll('.form-check-input').forEach(chkbox => {
        chkbox.addEventListener('change', (event)=> {
            if (event.target.checked) {
                event.target.parentElement.parentElement.style.border = "1px solid white";
                checked_counter++;
                document.querySelector('#submit_btn_add_to_playlists').style.color = "white";
                document.querySelector('#submit_btn_add_to_playlists').style.backgroundColor = "#28a745";
            } else {
                event.target.parentElement.parentElement.style.border = "1px solid transparent";
                checked_counter--;
                if (checked_counter == 0) {
                    document.querySelector('#submit_btn_add_to_playlists').style.color = "#28a745";
                    document.querySelector('#submit_btn_add_to_playlists').style.backgroundColor = "transparent";
                }
            }
        });
    });

});