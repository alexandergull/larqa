/*
Текущий этап разработки:
	вывод таблицы в тестовом режиме - накидал старт таблицы в layout JS - допилить конструктор блоков construct_details_block, взять за оснорву дублируемый код добавления блоков в  call_layout_window
Задачи

	парсинг HTML через popup
	вывод таблицы через popup
	анализ данных (можно выводить третьим td в блоке, потребуется ещё одно поле boolean в Details)
*/


class Detail {
	
	constructor( 
	
		detail_name , 
		block_id ,
		signature ,
		value ,
		css_id,
		section_id
		
	) 
	
	{
	
		//Init class
		this.detail_name  =  detail_name;
		this.block_id  =  block_id;
		this.signature  =  signature;
		this.value  =  value;
		this.css_id  =  css_id;	
		this.section_id = 	section_id;	

	}
	
	misc_show_detail(){
		console.log(
		'detail_name '  +  this.detail_name  +  ' '  +
		'block_id '  +  this.block_id  +  ' '  +
		'signature '  +  this.signature  +  ' '  +
		'value '  +  this.value  +  ' '  +
		'css_id '  +  this.css_id + ' ' +
		'section_id '  +  this.section_id
		)
	}

}

class Option {
	
	constructor( 
	
		name, 
		value,
		signature,
		priority,
	
	) 
	
	{
	
		//Init class
		this.name  =  name;
		this.value  =  value;
		this.signature  =  signature;
		this.priority =  priority;

	}
	
	misc_show_option(){

	}

	
}

//============HELPER BLOCK

//укрощение console.log
function log(txt,text){
	console.log(txt);
}

//забираем HTML
extracted_html = init_html_array();

// объявляем длину массива объектов Details
let detail_array_length = set_detail_data_parse_values()[1]; log ('Details array length from var ' + detail_array_length);

//============HELPER BLOCK END

//Разбивает HTML на секции для парсинга
function html_sections ( section_name, text){


	// подпись берём из переменной функции
	let signature = `<div class="section_block" data-section="` + section_name + `">`; 
	// начальная позиция определена
	start_sec = extracted_html.indexOf (signature);
		// конечная позиция определена
		for (let i = start_sec+1; i <= extracted_html.length; i++) {

			if (( extracted_html.slice(i,i+40)  ) == '<div class="section_block" data-section=') {
				
				end_sec = i;
				
				break;
			}
		}
		
//Выводим всё, что нашли по имени секции
//log('SECTION info start// Name:' + section_name + '; Signature: '+ signature + '; Start from:' + start_sec + '; End with' + end_sec);
	
	return extracted_html.slice ( start_sec , end_sec );
}

//Поиск значений внутри секции
function html_search_values ( section_id, signature, text ) {
		//секция определена
		let html_section = html_sections(section_id);
		// начальная позиция определена 11- это символы <td>:&nbsp;

		let start_value_pos;
		if (html_section.includes(signature)) {

			start_value_pos = (html_section.indexOf(signature) + signature.length + 11); //стартовая позиция для искомого значения

		} else {

			return 'Вхождение не найдено';

		}

//обзор исследуемого отрывка кода
/* 	log ('-->Block ', signature, ' starts from ' , start_value_pos);
	log ('-->Value of next 25 symbols:', 
	html_section.slice (
		start_value_pos - 50, 
		( start_value_pos + 50 )
							)		
					); */
					
		//конечная позиция определена
		for (let i = start_value_pos; i <= html_section.length; i++) {
				//log(html_section.slice(i,i+5));
					if (( html_section.slice(i,i+5)  ) == '</td>') {
						end_value_pos = i;
						break;
					}
		}
		
		return html_section.slice ( start_value_pos , end_value_pos );

	}

// Внесение результатов посика в массив объектов Details 
function insert_detail_names_to_detail_array(ct_request) {
	
			log('Функция заполнения values для маccива Details начала работать');
			for (let i=0; i<detail_array_length; i++){
		
				ct_request[i].value = html_search_values (ct_request[i].section_id,ct_request[i].signature);
			log (ct_request[i]);
			}
			log('Функция заполнения values для маccива Details закончила работать');
}

//Инициализация объектов в массиве
function init_details_array ( array ){
log ('Инициализация массива Details началась');	
let ct_request  =  [];

let values = array[0]; 

let length = detail_array_length;

	for (let i = 0; i < length; i++) {
		
		ct_request.push  (   new   Detail  (  ( values[i][0]),(values[i][1]),(values[i][2]),(values[i][3]),(values[i][4]),(values[i][5] )  )  );

	}
log ('Инициализация массива Details закончена.');	
return ct_request;

}

//Вызов значения value объекта Detail по имени
function call_detail_value_by_name (name, text) {
	log('Функция поиска значния по имени начала работать..');
	log('Ищем значение по:'+ name);
	for (i=0; i<detail_array_length; i++){

		if (ct_request[i].detail_name == name) {
			
			log('Найдено: ' + ct_request[i].value);
			
		}
	log('Функция поиска значния по имени закончила работать..');	
	}
	
}
document.body.onload = function(){
	
	document.getElementById('show_html').onclick = function(){
	
		console.log(init_html_array());
    
	}

log('Документ загружен');
	
	document.getElementById('show_details').onclick = function(){
		// объявляем ct_request
		ct_request = init_details_array ( set_detail_data_parse_values() ) ;
		
		insert_detail_names_to_detail_array ( ct_request );
		
		call_detail_value_by_name ('submit_time');

		call_layout_window();
			
			log ('Конец обработчика show_details.')
		}
	
	
	
		
//<div class="section_block" data-section="network_by_id">
	}