document.addEventListener('DOMContentLoaded', ()=> {

    let genre_mp = {};
    genre_mp["History"] = "badge-dark"; 
    genre_mp["Education"] = "badge-secondary"; 
    genre_mp["Crime"] = "Badge warning"; 
    genre_mp["Comedy"] = "badge-primary"; 
    genre_mp["Health"] = "badge-success"; 
    genre_mp["Thriller"] = "badge-info"; 
    genre_mp["Romance"] = "badge-danger"; 
    genre_mp["Adventure"] = "badge-danger"; 
    genre_mp["Sci-Fi"] = "badge-secondary"; 
    genre_mp["Fantasy"] = "badge-success"; 
    genre_mp["Action"] = "badge-danger"; 
    genre_mp["Mystery"] = "badge-info"; 
    genre_mp["Horror"] = "badge-dark"; 

    document.querySelector('#search_bar_at_index_top').addEventListener('focus', ()=> {
        document.querySelector('#search_results_index').style.display = 'block';
    });
    document.querySelector('#main_body_of_index_page').addEventListener('click', ()=> {
        document.querySelector('#search_results_index').style.display = 'none';
    });
    // search function
    document.querySelector('#search_bar_at_index_top').addEventListener('keyup', function(event) {
        var query = this.value;
        if (query.length == 0) {
            document.querySelector('#search_results_index_title').innerHTML = 'Search results will appear here';
            document.querySelector('#actual_search_result_index').innerHTML = '';
        } else {
            document.querySelector('#search_results_index_title').innerHTML = `Showing results for '${query}':`
            fetch(`/search`, {
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
                    document.querySelector('#actual_search_result_index').innerHTML = '';
                    for (var i=0; i<results.length; i++)
                    {
                        var book = results[i];
                        var searchResult = document.createElement('div');
                        searchResult.classList.add('search_result_div');
                        let firstChild = document.createElement('div');
                        firstChild.classList.add('div_containing_search_result_img');
                        firstChild.innerHTML = `
                            <a href="book/${book.id}">
                                <img class="search_results_img" src="${book.image}">
                            </a>`;

                        let secondChild = document.createElement('div');

                        let GC_one = document.createElement('div');
                        GC_one.classList.add('results_title');
                        let grandchild_a = document.createElement('a');
                        grandchild_a.href = `book/${book.id}`;
                        let greatGC = document.createElement('p');
                        greatGC.classList.add('results_title');     
                        greatGC.innerHTML = book.title;
                        grandchild_a.appendChild(greatGC);
                        GC_one.appendChild(grandchild_a);

                        let GC_two = document.createElement('div');
                        GC_two.classList.add('results_description');
                        let GGC_p = document.createElement('p');
                        GGC_p.classList.add('results_description');
                        GGC_p.innerHTML = book.description;
                        GC_two.appendChild(GGC_p);

                        secondChild.appendChild(GC_one);
                        secondChild.appendChild(GC_two);

                        searchResult.appendChild(firstChild);
                        searchResult.appendChild(secondChild);

                        document.querySelector('#actual_search_result_index').appendChild(searchResult);
                    }
                    if (results.length == 0) {
                        document.querySelector('#actual_search_result_index').innerHTML = 'No results found.'
                    }
                }
            });

        }
    });
    // if search btn pressed
    document.querySelector('#search_form').addEventListener('submit', (event)=> {
        event.preventDefault();
    });

    // to create playlist, show when + is clicked
    document.querySelector('#create_playlist_popup_in_index').addEventListener('click', ()=> {
        document.querySelector('#popup_form_create_playlist_index').style.display = 'grid';
    });

    // create playlist hide when close button clicked
    document.querySelector('#close_popup_form_for_create_playlist').addEventListener('click', () => {
        document.querySelector('#popup_form_create_playlist_index').style.display = 'none';
    });

    // create new playlist form is submitted
    document.querySelector('#create_new_playlist_form_index').addEventListener('submit', (event) => {
        event.preventDefault();
        var name_of_new_playlist = document.querySelector('#name_of_new_playlist').value;
        var img_of_new_playlist = document.querySelector('#img_of_new_playlist').value;
        if (!img_of_new_playlist) {
            img_of_new_playlist = "https://static.vecteezy.com/system/resources/previews/023/450/939/non_2x/online-education-icon-online-courses-illustration-sign-webinar-symbol-or-logo-vector.jpg";
        }
        fetch(`/create_playlist`, {
            method: 'POST',
            body: JSON.stringify({
                title : name_of_new_playlist,
                img : img_of_new_playlist
            })
        })
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                alert(result.error)
            } else {
                var playlist_id = result.id;
                // append new playlist
                var newCard = document.createElement('div');
                newCard.classList.add('card_divs_for_playlist_in_index')
                newCard.innerHTML = `
                    <a href="playlist/${playlist_id}">
                        <img class="img_for_playlist_in_index" src="${img_of_new_playlist}">
                    </a>
                    <br>
                    <div class="captions_for_playlist_cards_index">${name_of_new_playlist}</div>`;
                document.querySelector('#playlist_on_index_page').appendChild(newCard);
            }
        })        
        document.querySelector('#popup_form_create_playlist_index').style.display = 'none';
    });

    let loads = 0;
    let extras = 0;
    // show more
    document.querySelector("#show_more").addEventListener('click', ()=> {
        loads += 1;
        fetch(`/load/${loads}`)
        .then(response => response.json())
        .then(results => {
            if (results.error) {
                alert(results.error)
            } else {
                
                for (let i=loads*10+extras; i<10+loads*10+extras; i++)
                {        
                    if (i > results.length-1)
                    {
                        break;
                    }
                    var load_results = "";
                    var to_add_node = document.createElement('div');
                    to_add_node.classList.add("card_divs_for_to_read_in_index");
                    var str_genres = "";
                    for (var j=0; j<results[i].genres.length; j++)
                    {
                        str_genres += `<span class="badge ${genre_mp[results[i].genres[j]]}">${results[i].genres[j]}</span>`;
                    }
                    load_results += `
                        <a href="book/${results[i].id}">
                            <img class="img_for_to_read_in_index" src="${results[i].image}">
                        </a>
                        <br>
                        <div class="captions_for_to_read_cards_index">${results[i].title}</div>
                        <div class="div_for_genres_wrap">
                            ${str_genres}
                        </div>
                    `;
                    to_add_node.innerHTML = load_results;
                    document.querySelector('#actual_books_to_read').appendChild(to_add_node);
                }    
                /* hide showmore/showall button where appropriate */ 
                if (results.length <= 10 + loads*10 + extras) {
                    document.querySelector('#centered_two_btn').innerHTML = '';
                }
            }
        });

    });
    // show all 
    document.querySelector("#show_all").addEventListener('click', ()=> {
        loads = 0;
        fetch(`/load/${loads}`)
        .then(response => response.json())
        .then(results => {
            if (results.error) {
                alert(results.error)
            } else {
                var load_results = "";
                for (var i=0; i<results.length; i++)
                {
                    var str_genres = "";
                    for (var j=0; j<results[i].genres.length; j++)
                    {
                        str_genres += `<span class="badge ${genre_mp[results[i].genres[j]]}">${results[i].genres[j]}</span>`;
                    }
                    load_results += `
                    <div class="card_divs_for_to_read_in_index">
                        <a href="book/${results[i].id}">
                            <img class="img_for_to_read_in_index" src="${results[i].image}">
                        </a>
                        <br>
                        <div class="captions_for_to_read_cards_index">${results[i].title}</div>
                        <div class="div_for_genres_wrap">
                            ${str_genres}
                        </div>
                    </div>
                    `;
                }
                /* hide showmore/showall button where appropriate */
                document.querySelector('.to_read_books_list').innerHTML = load_results;            
            }
        });

    });


    document.querySelectorAll('.prog_bar_cont').forEach(bar => {
        let val = bar.parentElement.firstElementChild.value;
        bar.style.width = val + '%';
    });
    
    document.querySelector('#add_book_btn').addEventListener('click', ()=> {
        document.querySelector('#popup_add_book').style.display = 'block';
    });
    document.querySelector('#btn_close_add_book').addEventListener('click', ()=> {
        document.querySelector('#popup_add_book').style.display = 'none';
    });

    const genres = [];

    // when genre btns are clicked
    document.querySelectorAll('.genre_btn_add_book').forEach(btn => {
        btn.addEventListener('click', ()=> {
            if (btn.style.filter == "brightness(100%)") {
                btn.style.filter = "brightness(50%)";
                genres.splice(genres.indexOf(btn.textContent), 1);
            } else {
                btn.style.filter = "brightness(100%)";
                genres.push(btn.textContent);
            }
        });
    });

    // dynamically change image for add book form
    document.querySelector('#ab_img').addEventListener('keyup', ()=> {
        if (document.querySelector('#ab_img').value == "") {
            document.querySelector('#ab_actual_img').src = "https://thumbs.dreamstime.com/b/vintage-paper-texture-decorative-border-frame-old-paper-decorative-border-112688209.jpg";
        } else {
            document.querySelector('#ab_actual_img').src = document.querySelector('#ab_img').value;
        }
    });

    // submission of add_book_form
    document.querySelector('#add_book_form').addEventListener('submit', (event)=> {
        event.preventDefault();
        let title = document.querySelector('#ab_title').value;
        let url = document.querySelector('#ab_url').value;
        let img = document.querySelector('#ab_img').value;
        let rating = document.querySelector('#ab_rating').value;
        let description = document.querySelector('#ab_description').value;
        let curr_page = document.querySelector('#ab_curr_page').value;
        let tot_page = document.querySelector('#ab_tot_page').value;
        fetch('/add_book', {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                url: url,
                rating: rating,
                description: description,
                genres: genres.toString(),
                image: img,
                total_pages: tot_page,
                current_page: curr_page,
            })
        })
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                document.querySelector('#ab_error').innerHTML = `<span style="color: red">${result.error}</span><br>`;
            } else {
                document.querySelector('#ab_error').innerHTML = '<span style="color: limegreen">Book sucessfully added!</span><br>';

                // update frontend
                if (curr_page == tot_page) {
                    var parent = document.querySelector('#done_reading_main_div');
                    var new_book = document.createElement('div');
                    new_book.classList.add('card_divs_for_continue_reading_in_index');
                    new_book.innerHTML = `
                        <a href="book/${result.id}">
                            <img class="img_for_continue_reading_in_index" src="${result.img}">
                        </a>
                        <div class="progress">
                            <div class="progress-bar" role="progressbar" style="background-color: #28a745; width: 100%;" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="captions_for_continue_reading_cards_index">${result.title}</div>
                    `;
                    parent.prepend(new_book);

                    // clears "No books found" msg if exists
                    if (document.querySelector('#empty_msg_to_read')) {
                        document.querySelector('#empty_msg_to_read').innerHTML = '';
                    }
                } else if (curr_page == 0) {
                    var parent = document.querySelector('#actual_books_to_read');
                    var new_book = document.createElement('div');
                    new_book.classList.add('card_divs_for_to_read_in_index');
                    var myHTML = `
                        <a href="book/${result.id}">
                            <img class="img_for_to_read_in_index" src="${result.img}">
                        </a>
                        <br>
                        <div class="captions_for_to_read_cards_index">${result.title}</div>
                        <div class="div_for_genres_wrap">
                    `;
                    for (let i=0; i<genres.length; i++)
                    {
                        myHTML += `<span class="badge ${genre_mp[genres[i]]}">${genres[i]}</span>`;
                    }
                    myHTML +=`</div></div>`;
                    new_book.innerHTML = myHTML;
                    parent.prepend(new_book);
                    extras++;

                    // clears "No books found" msg if exists
                    if (document.querySelector('#empty_msg_continue')) {
                        document.querySelector('#empty_msg_continue').innerHTML = '';
                    }
                } else {
                    var parent = document.querySelector('#continue_reading_main_div');
                    var new_book = document.createElement('div');
                    new_book.classList.add('card_divs_for_continue_reading_in_index');
                    new_book.innerHTML = `
                        <a href="book/${result.id}">
                            <img class="img_for_continue_reading_in_index" src="${result.img}">
                        </a>
                        <div class="progress">
                            <input type="hidden" value="${result.current_page / result.total_pages * 100}">
                            <div class="prog_bar_cont" class="progress-bar" role="progressbar" style="background-color: #28a745; width: ${result.current_page / result.total_pages * 100}%" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="captions_for_continue_reading_cards_index">${result.title}</div>
                    `;
                    parent.prepend(new_book);

                    // clears "No books found" msg if exists
                    if (document.querySelector('#empty_msg_continue')) {
                        document.querySelector('#empty_msg_continue').innerHTML = '';
                    }
                }

                // clear form
                document.querySelector('#ab_title').value = '';
                document.querySelector('#ab_url').value = '';
                document.querySelector('#ab_img').value = '';
                document.querySelector('#ab_rating').value = '';
                document.querySelector('#ab_description').value = '';
                document.querySelector('#ab_curr_page').value = '';
                document.querySelector('#ab_tot_page').value = '';
                genres.splice(0, genres.length);
                document.querySelectorAll('.genre_btn_add_book').forEach(btn => {
                    btn.style.filter = "brightness(50%)";
                });
            }
        });
    });

    // stars for reccommended books
    document.querySelectorAll('#rec_rating').forEach(div => {
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


    // bground image for reccomended books
    document.querySelectorAll('.recommended_books_list_img').forEach(img => {
        let target = img.parentElement.parentElement.parentElement;
        target.style.backgroundImage = `url(${img.src})`;
    });
});