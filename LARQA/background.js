class Id {

	constructor(
		value,
		link_noc,
		link_user
	) {
		this.value = value;
		this.link_noc = link_noc;
		this.link_user = link_user;
	}

	init() { // берёт request ID из массива HTML и делает ссылки на него

		const signature = `<div class="panel-heading">Запрос `;

		if (extracted_html.includes(signature)) {
			let start_position = ( (extracted_html.indexOf(signature) + (signature.length) ) )
			this.value = (extracted_html.slice (start_position, (parseInt(start_position) + 32) ) );
		} else
			alert('id.init - value not found')

		if (this.value) { //формирует ссылки на ПУ и на НОК
			this.link_noc = 'https://cleantalk.org/noc/requests?request_id=' + this.value;
			this.link_user = 'https://cleantalk.org/my/show_requests?request_id=' + this.value;
		} else
			alert('id.init - no links data')
	} // берёт request ID из массива HTML и делает ссылки на него
}

class Status {

	constructor(
		agent,
		isAllowed,
		filters,
		type
	) {
		this.agent = agent;
		this.isAllowed = isAllowed;
		this.filters = filters;
		this.type = type; //todo допилить status.type
	}

	init() {

		if (ct.details) {

			//поиск агента
			this.agent = ct.get_detail_value_by_name('ct_agent');

			//поиск одобрен/нет
			this.isAllowed = ct.get_detail_value_by_name('is_allowed');

			//поиск типа запроса
			switch (ct.get_detail_value_by_name('method_name')) {
				case 'check_newuser':
					this.type = "registration";
					//TODO вот тут можно допилить условия для поиска комментария по comment_type
					break;

				case 'check_message':
					this.type = "comment or contact form";
					break;

				default:
					alert('status.init - no method_name found');

			}

		} else alert('ct.details - details block not found');

		if (this.isAllowed) {this.isAllowed = 'ALLOWED'} else this.isAllowed = 'DENIED';

		// поиск значения фильтров - тот ещё геморрой

		const signature = `"Добавить в произвольный блок"></span>&nbsp;</td>`;
		const filters_section = html_get_section('filters');
		const start_fs = filters_section.indexOf(signature) + 49;

		let end_fs = null;

		for (let i = start_fs + 1; i <= filters_section.length; i++) {

			if ((filters_section.slice(i, i + 2)) === 'R:') {
				end_fs = i;
				break;

			}
		}
		// отрезает строку филтьтров, удаляет форматирование, оставляет только ффильтр и значение
		this.filters = (filters_section.slice(start_fs, end_fs));

		for (let i = 0; i <= this.filters.length; i++) { //удаляет форматирование, оставляет только ффильтр и значение

			if (this.filters.slice(i, i + 4) === '<td>') {
				this.filters = this.filters.slice(0, i) + this.filters.slice(i + 4, this.filters.length)
				i--;
			}

			if (this.filters.slice(i, i + 6) === '&nbsp;') {
				this.filters = this.filters.slice(0, i) + this.filters.slice(i + 6, this.filters.length)
				i--;
			}

			if (this.filters.slice(i, i + 5) === '</td>') {
				this.filters = this.filters.slice(0, i) + this.filters.slice(i + 5, this.filters.length)
				i--;
			}

			if (this.filters.slice(i, i + 32) === '<a href="#" class="edit_filter">') {
				this.filters = this.filters.slice(0, i) + this.filters.slice(i + 32, this.filters.length);
				i--;
			}

			if (this.filters.slice(i, i + 4) === '</a>') {
				this.filters = this.filters.slice(0, i) + this.filters.slice(i + 4, this.filters.length);
				i--;
			}

		}

		//экстракция IP адреса по регулярке
		pub_ip_trimmed = ct.get_detail_value_by_name('sender_ip',);
		pub_ip_trimmed = pub_ip_trimmed.match(/(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/);
		pub_ip_trimmed = pub_ip_trimmed[0];

	}

}

class Detail {

	constructor(

		name,
		block_id,
		signature,
		value,
		css_id,
		section_id

	) {

		//Init class
		this.name = name;
		this.block_id = block_id;
		this.signature = signature;
		this.value = value;
		this.css_id = css_id;
		this.section_id = section_id;

	}

}

class CT {

	constructor(

		id,
		status,
		details,
		options,
		analysis

	) {
		this.id = id; // class Id
		this.status = status; // class Status
		this.details = details; // array of class Detail
		this.options = options; //array of class Option
		this.analysis = analysis;
	}

	init_details_signature_data() { // ДАННЫЕ!! Установка данных для поиска в HTML лапше, возвращает массив и длину массива

		const values = [
			// имя параметра, номер блока, сигнатура, РЕЗЕРВ, стиль, где искать
			['sender_email', '0', '<td>email&nbsp;</td>', '', 'default', 'sender'],
			['sender_email_is_bl', '0', '<td>email_in_list&nbsp;</td>', '', 'default', 'details'],
			['sender_email_is_sc', '0', '<td>short_cache_email&nbsp;</td>', '', 'default', 'details'],
			['sender_email_is_disp', '0', '<td>mail_domain_one_raz&nbsp;</td>', '', 'default', 'details'],
			['sender_ip', '1', '<td>ip&nbsp;</td>', '', 'default', 'sender'],
			['sender_ip_is_bl', '1', '<td>ip_in_list&nbsp;</td>', '', 'default', 'details'],
			['sender_ip_is_sc', '1', '<td>short_cache_ip&nbsp;</td>', '', 'default', 'details'],
			['ct_options', '2', '<td>ct_options&nbsp;</td>', '', 'default', 'sender'],
			['ct_agent', '3', '<td>agent&nbsp;</td>', '', 'default', 'params'],
			['js_status', '4', '<td>js_on&nbsp;</td>', '', 'default', 'params'],
			['submit_time', '4', '<td>submit_time&nbsp;</td>', '', 'default', 'params'],
			['cookies_enabled', '4', '<td>cookies_enabled&nbsp;</td>', '', 'default', 'sender'],
			['page_referrer', '4', '<td>REFFERRER&nbsp;</td>', '', 'default', 'sender'],
			['page_pre_referrer', '4', '<td>REFFERRER_PREVIOUS&nbsp;</td>', '', 'default', 'sender'],
			['page_url', '4', '<td>page_url&nbsp;</td>', '', 'default', 'sender'],
			['sender_url', '4', '<td>sender_url&nbsp;</td>', '', 'default', 'sender'],
			['comment_type', '4', '<td>comment_type&nbsp;</td>', '', 'default', 'sender'],
			['hook_type', '4', '<td>hook&nbsp;</td>', '', 'default', 'sender'],
			['is_greylisted', '4', '<td>grey_list_stop&nbsp;</td>', '', 'default', 'details'],
			['is_mobile_ua', '4', '<td>is_mobile_UA&nbsp;</td>', '', 'default', 'details'],
			['links_detected', '4', '<td>links&nbsp;</td>', '', 'default', 'details'],
			['allowed_by_pl', '4', '<td>private_list_allow&nbsp;</td>', '', 'default', 'details'],
			['denied_by_pl', '4', '<td>private_list_deny&nbsp;</td>', '', 'default', 'details'],
			['pl_has_records', '4', '<td>private_list_detected&nbsp;</td>', '', 'default', 'details'],
			['is_allowed', '4', '<td>allow&nbsp;</td>', '', 'default', 'response'],
			['method_name', '4', '<td>method_name&nbsp;</td>', '', 'default', 'details']
		];

//длина массива данных для поиска определена
		pub_details_array_length = values.length;

		return values;


	}// ДАННЫЕ!! Установка данных для поиска в HTML лапше, возвращает массив и длину массива

	draw_details_block() { //рисует блоки основываясь на Section ID

		let ar = [];

		for (let j = 0; j < pub_details_array_length; j++) {
			ar.push(parseInt(this.details[j].block_id));
		}

		const number_of_blocks = Math.max.apply(null, ar) + 1; //колчество блоков определено

		for (let block_id = 0; block_id !== number_of_blocks; block_id++) {
			
			draw_html_tag('details_table-tbody', 'beforeend', ('<tr id="details_tier_block_' + block_id + '">SECTION ' + block_id + '</tr>'));

			for (let i = 0; i < pub_details_array_length - 1; i++) { //добавление строк
				
				if (pub_strcnt <= i) { //хуй знает как это работает и почему без этого не работает

					if (parseInt(this.details[pub_strcnt].block_id) === block_id) { // добавляем строки если block_id совпал

						pub_strcnt++;

						if (this.details[pub_strcnt].name !== 'ct_options') { //пропускаем блок options
							
								draw_html_tag('details_table-tbody', 'beforeend', ('<tr id="details_tier_' + pub_strcnt + '"></tr>'));
								draw_html_tag(('details_tier_' + pub_strcnt), 'beforeend', ('<td class="details-name">' + this.details[pub_strcnt].name + ':</td>'));

							if (this.details[pub_strcnt].name == 'sender_ip') { //допиливает строку sender IP (только для IPV4)
								draw_html_tag(('details_tier_' + pub_strcnt), 'beforeend', ('<td class="details-value">'
									+ this.details[pub_strcnt].value
									+ ' <a href="https://cleantalk.org/noc/requests?sender_ip='
									+ pub_ip_trimmed
									+ '">  [Все запросы с этим IP]  </a><a href="https://ipinfo.io/'
									+ pub_ip_trimmed
									+ '">  [IPINFO]</a></td>'));

							}   else
								draw_html_tag(('details_tier_' + pub_strcnt), 'beforeend', ('<td class="details-value">' + this.details[pub_strcnt].value + '</td>'));
							}
					}
				}
			}
		}

	}// рисует блоки Details основываясь на Section ID из set_details_signature_data

	draw_options_block() { // рисует блок опций

		pub_strcnt = 0;

		draw_html_tag('options_table-tbody', 'beforeend', ('<tr id="options_tier_block></tr>'));

		for (let i = 0; i < this.options.length; i++) { //добавление строк

			if (pub_strcnt <= i) { //хуй знает как это работает и почему без этого не работает

				draw_html_tag('options_table-tbody', 'beforeend', ('<tr id="options_tier_' + pub_strcnt + '"></tr>'));
				draw_html_tag(('options_tier_' + pub_strcnt), 'beforeend', ('<td class="options-name">' + this.options[pub_strcnt].name + ':</td>'));
				draw_html_tag(('options_tier_' + pub_strcnt), 'beforeend', ('<td class="options-value">' + this.options[pub_strcnt].value + '</td>'));

				pub_strcnt++;

			}
		}

	} // рисует блок опций

	draw_status_block(){

		//Ссылки в ПУ
		layout_window.document.getElementById('status_table_status-class-column').innerHTML += (
			' <p class="status_table_inner">Ссылки на запрос: <a href="' + ct.id.link_noc +'">[НОК] </a>'+
			' <a href="' + ct.id.link_user +'">[ПУ] </a>' +
			' </p>' );
		

		if (ct.status.filters != null) { // Подсветка фильтров с правками если фильтры вообще есть

			let service_or_user_id = '';

			if (ct.status.filters.includes('service_') || ct.status.filters.includes('user_')) {

				let start = '-';
				let end = 0;
				let id_regexp;

				for (let i = 0; i < ct.status.filters.length; i++) {

					if (((ct.status.filters.slice(i, i + 8)) === 'service_') || ((ct.status.filters.slice(i, i + 5)) === 'user_')) {
						start = i;
					}

					if (start !== '-') {

						if (ct.status.filters[i] === ':') {
							let end = i;

							if (start != '-' && end != '-') {
								service_or_user_id = ct.status.filters.slice(start, end)
								id_regexp = new RegExp(service_or_user_id, 'gi');
								end = 0;
							}

							start = '-';
						}
					}
				}

				ct.status.filters = ct.status.filters.replace(id_regexp, `<a style="color:#FF0000">` + service_or_user_id + `</a>`);

			} // Подсветка фильтров с правками
			layout_window.document.getElementById('status_table-filter-raw').innerHTML += (
				'Агент: [' + ct.status.agent + '] Фильтры: [' + ct.status.filters + ']'
			);
			layout_window.document.getElementById('layout_window_title').innerHTML += (' [' + ct.id.value + '] [' + ct.status.isAllowed + ']'); //todo менять цвет в зависимости от состояния
		}
	} // рисует блок статуса

	init_details_array() { //создаёт объекты Details в массиве (без values) на основе set_details_signature_data

		this.details = [];
		let values = this.init_details_signature_data();

		for (let i = 0; i < pub_details_array_length; i++) {
			this.details.push (
				new Detail(
					(values[i][0]),
					(values[i][1]),
					(values[i][2]),
					(values[i][3]),
					(values[i][4]),
					(values[i][5])
				)
			);
		}
		//Внесение результатов поиcка values в массив объектов Details
		for (let i = 0; i < pub_details_array_length; i++) {
			this.details[i].value = get_detail_signature_for_blocks(this.details[i].section_id, this.details[i].signature);
		}
	}//создаёт объекты Detail в массиве (без values) на основе set_details_signature_data TODO Убрать деление на секции, нахуй оно не нужно

	init_options_array () { 				//создаёт объекты Option в массиве ct.options

		this.options = get_options_from_json(this.get_detail_value_by_name("ct_options"));

	}			//создаёт объекты Option в массиве ct.options TODO Добавить сортировку, сначала выводить изменённые

	get_detail_value_by_name(name) { 	//вызывает значения value объекта Detail по имени

		for (let i = 0; i < pub_details_array_length; i++) {

			if (this.details[i].name === name) {
				return this.details[i].value
			}
		}
	} //вызывает значения value объекта Detail по имени

}

class Option {

	constructor(
		name,
		value,
		priority,
	) {

		this.name = name;
		this.value = value;
		this.priority = priority;

	}

}

class Analysis {

	constructor(

		options_default,
		options_important,
		details_normal_values

	) {

		this.options_default = options_default;
		this.details_normal_values = details_normal_values;

	}

	trim_and_low (option_value) { //todo Унести в options_from_json

		let resstring = option_value;
		resstring = resstring.toString().trim();
		resstring = resstring.toLowerCase();
		return (resstring);

	}
//todo Проверить почему не совпало количество опицй https://cleantalk.org/noc/requests?request_id=4d6d82ee9e7d3e7da409520725a9b6d4, убрать проверку по количеству опций
  //todo не отрабатывает post_info для comment type

	init_options_default() { 			//устанавлвает опции по умолчанию

		this.options_default = { // объект опций
			wordpress: '',
			drupal: '',
			joomla: '',
		}
		//берёт массив опций из JSON
		this.options_default.wordpress = get_options_from_json('{"spam_firewall":"1","sfw__anti_flood":"1","sfw__anti_flood__view_limit":"10","sfw__anti_crawler":"1","sfw__anti_crawler_ua":"1","apikey":"9arymagatetu","autoPubRevelantMess":"0","registrations_test":"1","comments_test":"1","contact_forms_test":"1","general_contact_forms_test":"1","wc_checkout_test":"1","wc_register_from_order":"1","search_test":"1","check_external":"0","check_external__capture_buffer":"0","check_internal":"0","disable_comments__all":"0","disable_comments__posts":"0","disable_comments__pages":"0","disable_comments__media":"0","bp_private_messages":"1","check_comments_number":"1","remove_old_spam":"0","remove_comments_links":"0","show_check_links":"1","manage_comments_on_public_page":"0","protect_logged_in":"1","use_ajax":"1","use_static_js_key":"-1","general_postdata_test":"0","set_cookies":"1","set_cookies__sessions":"0","ssl_on":"0","use_buitin_http_api":"1","exclusions__urls":"","exclusions__urls__use_regexp":"0","exclusions__fields":"","exclusions__fields__use_regexp":"0","exclusions__roles":["Administrator"],"show_adminbar":"1","all_time_counter":"0","daily_counter":"0","sfw_counter":"0","user_token":"","collect_details":"0","send_connection_reports":"0","async_js":"0","debug_ajax":"0","gdpr_enabled":"0","gdpr_text":"","store_urls":"1","store_urls__sessions":"1","comment_notify":"1","comment_notify__roles":[],"complete_deactivation":"0","dashboard_widget__show":"1","allow_custom_key":"0","allow_custom_settings":"0","white_label":"0","white_label__hoster_key":"","white_label__plugin_name":"","use_settings_template":"0","use_settings_template_apply_for_new":"0","use_settings_template_apply_for_current":"0","use_settings_template_apply_for_current_list_sites":""}');

	}

	compare_ct_options_with_default_agent(def_options_agent) { //сравнение опций из запроса с опциями по умолчанию

		let changes_array = [];

		if (def_options_agent.length === ct.options.length) {

			for (let i = 0; i <= def_options_agent.length - 1; i++) {

				let x = def_options_agent[i].value.toString()
				let y = ct.options[i].value.toString();
				if (x !== y) {
					changes_array.push(i);

				}
			}
		} else {

			alert('Количество опций не совпало. Ничего страшного, возможно плагин устарел. По умолчанию : ' + def_options_agent.length + ', в запросе = ' + ct.options.length);

			for (let i = 0; i <= def_options_agent.length - 1; i++) {

				for (let j = 0; j<= ct.options.length -1; j++) {

					if ( (def_options_agent[i].name === ct.options[j].name) && ( this.trim_and_low(def_options_agent[i].value) !== this.trim_and_low(ct.options[j].value) )) {

						changes_array.push(j);

					}
				}
			}
		}

		// подсветка изменённых опций

		changes_array.forEach(function (value) {

			//alert('Array '+changes_array);
			let tr_name = ('options_tier_' + value);
			layout_window.document.getElementById(tr_name).style.color = '#FF0000';

		})

		layout_window.document.getElementById('options_header').innerHTML += ('<a style = "color: red"> (' + changes_array.length + ')</a>');

		return changes_array;
	} //сравнение опций по умолчанию с текущими

	check_options() { // проверяет опции по умолчанию, вызывая check_options_comparison для кейсов по агенту
		//todo Дублирование опций обойти https://cleantalk.org/noc/requests?request_id=460ecc492b54f98b5b5bbf26a3629848
				if (ct.status.agent.includes('wordpress')) {
					this.compare_ct_options_with_default_agent(this.options_default.wordpress);
				}
	}

	check_details() {

	}


}

//==== TEST BLOCK

//==== TEST BLOCK END

//==== DECLARE BLOCK

let extracted_html;
let pub_ip_trimmed;
let pub_details_array_length;
let ct = new CT();

ct.id = new Id();
ct.status = new Status();
ct.analysis = new Analysis();

//==== DECLARE BLOCK END

//==== NON CLASS FUNCTIONS

function html_get_section(section_name) { //извлекает html секции по Details.section_id

	const signature = `<div class="section_block" data-section="` + section_name + `">`; // подпись берём из параметра функции
	const start_section_position = extracted_html.indexOf(signature);// начальная позиция определена
	let end_section_position = null;
	for (let i = start_section_position + 1; i <= extracted_html.length; i++) {
		if ((extracted_html.slice(i, i + 40)) === '<div class="section_block" data-section=') {
			end_section_position = i; // конечная позиция определена
			break;
		}
	}
	return extracted_html.slice(start_section_position, end_section_position);

} 	//извлекает html секции по Details.section_id

function get_detail_signature_for_blocks(section_id, signature) { //ищет Detail.value по Detail.signature внутри секции Details.section_id

	const html_section = html_get_section(section_id); // секция определена
	let start_value_position;
	let end_value_position;

	if (html_section.includes(signature)) { // 11- это символы <td>:&nbsp;
		start_value_position = (html_section.indexOf(signature) + signature.length + 11); //стартовая позиция для искомого значения
	} else {
		return 'Вхождение не найдено';
	}

	for (let i = start_value_position; i <= html_section.length; i++) {
		if ((html_section.slice(i, i + 5)) === '</td>') {
			end_value_position = i; //конечная позиция определена
			break;
		}
	}
	return html_section.slice(start_value_position, end_value_position);

} 	//ищет Detail.value по Detail.signature внутри секции Details.section_id

function draw_html_tag(position_tag_id, align, html) { // добавляет тег на страницу

	layout_window.document.getElementById(position_tag_id).insertAdjacentHTML(align, html);

} //добавляет тег на страницу

function get_options_from_json(json) { //возвращает массив объектов OPTION из JSON настроек

	const jsonobj = JSON.parse(json);
	let temp = [];
	$.each(jsonobj, function (name, value) {
		temp.push(new Option(name, value, 0))
	})
	return temp;

} //возвращает массив объектов OPTION из JSON настроек

function call_layout_window() { //вызов окна запроса


	window.layout_window = window.open( // собственно основное окно
		'prefilled.html',
		'LARQA window',
		'left=50, ' +
		'top=50, ' +
		'width=1200, ' +
		'height=800, ' +
		'status=no, ' +
		'toolbar=no, ' +
		'location=no');

	layout_window.onload = function () { // действия после загрузки окна

		ct.init_details_array();
		ct.init_options_array();

		ct.id.init();
		ct.status.init();

		window.pub_strcnt = 0; //счётчик строк в таблице

		ct.draw_details_block();
		ct.draw_options_block();
		ct.draw_status_block();

		ct.analysis.init_options_default();
		ct.analysis.check_options();

	}//вызов окна запроса

} //вызов рабочего окна

chrome.runtime.onMessage.addListener(function (message) {
	switch (message.command) {

		case "pageHtml":
			extracted_html = message.html;
			call_layout_window();
			break;

		default:
			break;
	}
})

function logHtmlCode(tab) {
	chrome.tabs.executeScript(tab.id, {file: "send-page-code.js"});
}

chrome.browserAction.onClicked.addListener(logHtmlCode);
