document.addEventListener('DOMContentLoaded', ()=> {
    const xValues = ["Done reading", "To be read", "Reading"];
    const yValues = [];
    yValues.push(document.querySelector('#done_count').value);
    yValues.push(document.querySelector('#to_read_count').value);
    yValues.push(document.querySelector('#continue_count').value);
    yValues.push(0);
    const barColors = ["green", "red", "yellow"];

    let username = document.querySelector('#username').textContent;

    new Chart("barGraph", {
        type: "bar",
        data: {
            labels: xValues,
            datasets: [{
            backgroundColor: barColors,
            data: yValues
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {display: false},
            title: {
                display: true,
                text: `${username}'s statistics`
            }
        }
    });

    new Chart("pieChart", {
        type: "doughnut",
        data: {
          labels: xValues,
          datasets: [{
            backgroundColor: barColors,
            data: yValues
          }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: `${username}'s statistics`
            }
        }
    });

    document.querySelector('#back_btn_play').addEventListener('click', ()=> {
        window.history.back();
    });

    document.querySelectorAll('.prog_bar_cont').forEach(bar => {
        let val = bar.parentElement.firstElementChild.value;
        bar.style.width = val + '%';
    });

    document.querySelector('#edit_pfp').addEventListener('click', ()=> {
        document.querySelector('#popup_pfp').style.display = 'grid';
    });

    document.querySelector('#close').addEventListener('click', ()=> {
        document.querySelector('#popup_pfp').style.display = 'none';
    });

    // update pic
    document.querySelector('#img_input').addEventListener('keyup', ()=> {
        if (document.querySelector('#img_input').value.length == 0) {
            document.querySelector('#edit_pfp_img').src = document.querySelector('#target_img').src;
        } else {
            document.querySelector('#edit_pfp_img').src = document.querySelector('#img_input').value;
        }
    });

    // submit edit
    document.querySelector('#pfp_form').addEventListener('submit', (event)=> {
        event.preventDefault();
        let input = document.querySelector('#img_input');
        fetch(`/pfp`, {
            method: 'POST',
            body: JSON.stringify({
                img: input.value
            })
        })
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                alert(result.error);
            } else {
                document.querySelector('#edit_pfp_img').src = input.value;
                document.querySelector('#target_img').src = input.value;
                input.value = '';
                document.querySelector('#popup_pfp').style.display = 'none'; 
            }
        });
    });
});

