console.log('Script layout.js loaded');

function add_html (position_tag_id, align, html) {
log('POS ' + position_tag_id + ' ALGN ' + align + ' HTML ' + html);
        layout_window.document.getElementById(position_tag_id).insertAdjacentHTML(align,html);

}
// конструирование блоков
function construct_details_block (block_id){
	//
    add_html('main_tbody','beforeend',( '<tr id="tier_block_'+block_id+'">SECTION '+block_id+'</tr>' ));
	
	//добавление строк
    for (i=0; i<detail_array_length-1; i++){
		
		//хуй знает как это работает и почему без этого не работает
		if (stringcounter <= i) {
			
			// добавляем строки если block_id совпал
			if (ct_request[stringcounter].block_id == block_id) {
				stringcounter++;
				add_html('main_tbody','beforeend',( '<tr id="tier_'+stringcounter+'"></tr>' ));
				add_html(('tier_'+stringcounter),'beforeend',('<td>' + ct_request[stringcounter].detail_name+' #'+stringcounter +':</td>'));
				add_html(('tier_'+stringcounter),'beforeend',('<td>' + ct_request[stringcounter].value +'</td>'));

				
			} 
        } //else alert ('Stringcounter is overquoted');
    }
}

//вызов окна блоков
function call_layout_window() {
	
	//счётчик строк в таблице
	window.stringcounter = 0;
	
	// собственно основное окно
    layout_window = window.open('about:blank', 'blank', 'left=50, top=50, width=1000, height=700, status=no, toolbar=no, location=no');
	
	// действия после загрузки окна
    layout_window.onload = function () {
		
		// цвет боди
        layout_window.document.body.style.backgroundColor = "#3090c7";
		
		//тестовый див
		layout_window.document.body.insertAdjacentHTML("beforeend", ('<div id="test_div">Test div</div>'));

		//таблица и стили таблицы
        layout_window.document.head.insertAdjacentHTML("beforeend", ('<style type="text/css"> table {font-size: 12px; font-family: "Lucida Sans Unicode", "Lucida Grande", Sans-Serif;text-align: left;border-collapse: separate;border-spacing: 5px;background: #ECE9E0;color: #656665;border: 16px solid #ECE9E0;border-radius: 20px;}th {font-size: 18px;padding: 10px;}td {background: #F5F5F5;padding: 10px;} </style>'));
		
		//тело таблицы
        add_html('test_div','afterend','<table id="main_table"><tbody id="main_tbody"></tbody></table>');

        //5 - это количество блоков, надо бы определять в динамике
		for (j = 0; j<5; j++){
			
			construct_details_block (j);
			
			//window.alert('J counter = ' + j);
		};

    }
	
	//мусор убираем
	layout_window.onclose = function () {
		
		delete window
		
	}
}