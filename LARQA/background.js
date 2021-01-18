//todo перенести в класс Helper внеклассовые методы, начать с ISSUES
// останавливаю разработку до наведения порядка в коде
// нет поля username...

class Helper{

	debugMessage(msg){
		DEBUG_LIST += ('<p id="debug">' + msg + '</p>');
	}

	showDebugMsgList(){
		if (DEBUG_LIST !==''){
			helper_add_tag('status_table-tbody', 'beforeend', ('<tr id="debug"><td>DEBUG:'+DEBUG_LIST+'</td></tr>'));
			DEBUG_LIST = '';
		}
	}
}

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

		if (this.value) { //формирует ссылки на ПУ и на НОК
			this.link_noc = 'https://cleantalk.org/noc/requests?request_id=' + this.value;
			this.link_user = 'https://cleantalk.org/my/show_requests?request_id=' + this.value;
		}
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

			if (this.agent !== CURRENT_VERSIONS.get('wordpress'))  {
				this.agent = '<a title="Плагин устарел" style  = "color: red">'+this.agent+'</a>';
				ct.analysis.add_to_issues_list('Версия плагина устарела','3');
				ct.set_detail_prop_by_name('ct_agent','css_id','BAD');

			} else {
				this.agent = '<a title="Версия в порядке" style = "color: green">'+this.agent+'</a>';
			}

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

			}

		} else alert('ct.details - details block not found');

		if (this.isAllowed) {this.isAllowed = 'ALLOWED'} else this.isAllowed = 'DENIED';

		// поиск значения фильтров - тот ещё геморрой

		const signature = `"Добавить в произвольный блок"></span>&nbsp;</td>`;
		const filters_section = helper_get_html_section('filters');
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
		if (ct.get_detail_value_by_name('sender_ip',) !== '') {
			pub_ip_trimmed = ct.get_detail_value_by_name('sender_ip',);
			pub_ip_trimmed = pub_ip_trimmed.match(/(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/);
			pub_ip_trimmed = pub_ip_trimmed[0];
		}

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
			['sender_email', '0', '<td>email&nbsp;</td>', '', 'DEFAULT', 'sender'],
			['sender_email_is_bl', '0', '<td>email_in_list&nbsp;</td>', '', 'DEFAULT', 'details'],
			['sender_email_is_sc', '0', '<td>short_cache_email&nbsp;</td>', '', 'DEFAULT', 'details'],
			['sender_email_is_disp', '0', '<td>mail_domain_one_raz&nbsp;</td>', '', 'DEFAULT', 'details'],
			['sender_ip', '1', '<td>ip&nbsp;</td>', '', 'DEFAULT', 'sender'],
			['sender_ip_is_bl', '1', '<td>ip_in_list&nbsp;</td>', '', 'DEFAULT', 'details'],
			['sender_ip_is_sc', '1', '<td>short_cache_ip&nbsp;</td>', '', 'DEFAULT', 'details'],
			['ct_options', '2', '<td>ct_options&nbsp;</td>', '', 'DEFAULT', 'sender'],
			['ct_agent', '3', '<td>agent&nbsp;</td>', '', 'DEFAULT', 'params'],
			['js_status', '4', '<td>js_passed&nbsp;</td>', '', 'DEFAULT', 'details'],
			['submit_time', '4', '<td>submit_time&nbsp;</td>', '', 'DEFAULT', 'params'],
			['cookies_enabled', '4', '<td>cookies_enabled&nbsp;</td>', '', 'DEFAULT', 'sender'],
			['page_referrer', '4', '<td>REFFERRER&nbsp;</td>', '', 'DEFAULT', 'sender'],
			['page_pre_referrer', '4', '<td>REFFERRER_PREVIOUS&nbsp;</td>', '', 'DEFAULT', 'sender'],
			['page_url', '4', '<td>page_url&nbsp;</td>', '', 'DEFAULT', 'sender'],
			['sender_url', '4', '<td>sender_url&nbsp;</td>', '', 'DEFAULT', 'sender'],
			['comment_type', '4', '<td>comment_type&nbsp;</td>', '', 'DEFAULT', 'sender'],
			['hook_type', '4', '<td>hook&nbsp;</td>', '', 'DEFAULT', 'sender'],
			['is_greylisted', '4', '<td>grey_list_stop&nbsp;</td>', '', 'DEFAULT', 'details'],
			['is_mobile_ua', '4', '<td>is_mobile_UA&nbsp;</td>', '', 'DEFAULT', 'details'],
			['links_detected', '4', '<td>links&nbsp;</td>', '', 'DEFAULT', 'details'],
			['allowed_by_pl', '4', '<td>private_list_allow&nbsp;</td>', '', 'DEFAULT', 'details'],
			['denied_by_pl', '4', '<td>private_list_deny&nbsp;</td>', '', 'DEFAULT', 'details'],
			['pl_has_records', '4', '<td>private_list_detected&nbsp;</td>', '', 'DEFAULT', 'details'],
			['is_allowed', '4', '<td>allow&nbsp;</td>', '', 'DEFAULT', 'response'],
			['method_name', '4', '<td>method_name&nbsp;</td>', '', 'DEFAULT', 'details']
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

		const number_of_blocks = Math.max.apply(null, ar) + 1; 						//колчество блоков определено

		for (let block_id = 0; block_id !== number_of_blocks; block_id++) {
			
			helper_add_tag('details_table-tbody', 'beforeend', ('<tr id="details_tier_block_' + block_id + '">SECTION ' + block_id + '</tr>'));

			for (let i = 0; i < pub_details_array_length - 1; i++) { 						//добавление строк
				
				if (pub_strcnt <= i) { 														//хуй знает как это работает и почему без этого не работает

					let detail = this.details[pub_strcnt];

					if (parseInt(detail.block_id) === block_id) { 		// добавляем строки если block_id совпал

						if (detail.name !== 'ct_options') { 				//пропускаем блок options
							
							helper_add_tag('details_table-tbody', 'beforeend', ('<tr id="details_tier_' + pub_strcnt + '"></tr>'));

							if (detail.value !== 'INVISIBLE') {
																							//
// Подготовка шаблона ссылки для sender_email и sender_ip

							let href = '';
							let ip_additional_hrefs = '';
							let email_additional_hrefs = '';

							if (detail.name === 'sender_ip' || this.details[pub_strcnt].name ==='sender_email') {
								href = 'href=https://cleantalk.org/blacklists/'+ this.details[pub_strcnt].value + ' ';
							}

							if (detail.name === 'sender_ip'){
								ip_additional_hrefs = '<a href="https://cleantalk.org/noc/requests?sender_ip=' +
									detail.value +
									'">  [Все запросы с этим IP]  </a><a href="https://ipinfo.io/' +
									detail.value +
									'">  [IPINFO]</a></td>'
							}

							if (detail.name === 'sender_email'){
								email_additional_hrefs = '<a href="https://cleantalk.org/noc/requests?sender_email=' +
									detail.value +
									'">  [Все запросы с этим EMAIL]  </a><a href="https://cleantalk.org/email-checker/' +
									detail.value +
									'">  [CHECKER]</a></td>'
							}


//
// Подсветка параметров
								switch (detail.css_id){
	//по умолчанию чёрный
									case 'DEFAULT':{
										helper_add_tag(('details_tier_' + pub_strcnt),
											'beforeend',
											('<td class="details-name">'
												+ detail.name
												+ ':</td>'));
										helper_add_tag(
											('details_tier_' + pub_strcnt),
											'beforeend',
											('<td class="details-value">'
												+ detail.value
												+ '</a>'+ ip_additional_hrefs
												+ email_additional_hrefs +'</td>'));
									} break;
	//плохой - красный
									case 'BAD':{

										helper_add_tag(('details_tier_' + pub_strcnt),
											'beforeend',
											('<td class="details-name"><a style="color:#C02000">'
												+ detail.name + ':</td>'));

										helper_add_tag(
											('details_tier_' + pub_strcnt),
											'beforeend',
											('<td class="details-value"><a '+href+'style="color:#C02000">' +
												detail.value
												+ '</a>'+ ip_additional_hrefs
												+ email_additional_hrefs
												+'</td>'));

									} break;
	//хорошиий - зелёный
									case 'GOOD':{

										helper_add_tag(('details_tier_' + pub_strcnt),
											'beforeend',
											('<td class="details-name"><a style="color:#009000">'
												+ detail.name
												+ ':</a></td>'));

										helper_add_tag(
											('details_tier_' + pub_strcnt),
											'beforeend',
											('<td class="details-value"><a '
												+ href
												+'style="color:#009000">'
												+ detail.value
												+ '</a>'
												+ ip_additional_hrefs
												+ email_additional_hrefs +'</td>'));

									} break;
	//некорректный - бордовый
									case 'INCORRECT':{

										helper_add_tag(('details_tier_' + pub_strcnt),
											'beforeend',
											('<td class="details-name"><a style="color:#CC0000">'
												+ detail.name
												+ ':</a></td>'));

										helper_add_tag(
											('details_tier_' + pub_strcnt),
											'beforeend',
											('<td class="details-value"><a style="color:#CC0000">'
												+ detail.value
												+ '</a>'
												+ ip_additional_hrefs
												+ email_additional_hrefs
												+'</td>'));

									}
								}
//
							}
						}
						pub_strcnt++; //счётчик строк увеличен в конце цикла
					}
				}
			}
		}

	}// рисует блоки Details основываясь на Section ID из set_details_signature_data

	draw_options_block() { // рисует блок опций

		pub_strcnt = 0;

		helper_add_tag('options_table-tbody', 'beforeend', ('<tr id="options_tier_block></tr>'));

		for (let i = 0; i < this.options.length; i++) { //добавление строк

			if (pub_strcnt <= i) { //хуй знает как это работает и почему без этого не работает

				helper_add_tag('options_table-tbody', 'beforeend', ('<tr id="options_tier_' + pub_strcnt + '"></tr>'));
				helper_add_tag(('options_tier_' + pub_strcnt), 'beforeend', ('<td class="options-name">' + this.options[pub_strcnt].name + ':</td>'));
				helper_add_tag(('options_tier_' + pub_strcnt), 'beforeend', ('<td class="options-value">' + this.options[pub_strcnt].value + '</td>'));

				pub_strcnt++;

			}
		}

	} // рисует блок опций

	draw_status_block(){

		let list_of_issues ='';
		let amount_of_issues = 0;
		let issues_number = 0;
		for (let entry of ISSUES.keys()) {
			list_of_issues += ' - '+entry +'<br>';
		}
		for (let entry of ISSUES.values()) {
			amount_of_issues += Number(entry);
			issues_number++;
		}


		//Ссылки в ПУ
		layout_window.document.getElementById('status_table_status-class-column').innerHTML += (
			' <p class="status_table_inner">Ссылки на запрос: <a href="' + ct.id.link_noc +'">[НОК] </a>'+
			' <a href="' + ct.id.link_user +'">[ПУ] </a>' +
			' </p>' +
			' <p class="status_table_inner">Найденные проблемы в запросе('+issues_number+'): <br><b>' + list_of_issues +
			' </b></p>' +
			' <p class="status_table_inner">Итоговый вес проблем: <b>' + amount_of_issues + '</b>'
			);
		

		if (ct.status.filters != null) { // Подсветка фильтров с правками если фильтры вообще есть

			let service_or_user_id = '';

			if (ct.status.filters.includes('service_') || ct.status.filters.includes('user_')) {

				let start = '-';
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

				ct.status.filters = ct.status.filters.replace(id_regexp, `<a style="color:#990000">` + service_or_user_id + `</a>`);
				ct.analysis.add_to_issues_list('Для пользователя правились фильтры.','0');

			} // Подсветка фильтров с правками

			layout_window.document.getElementById('status_table-filter-raw').innerHTML += (
				'Агент: [' + ct.status.agent + '] Фильтры: [' + ct.status.filters + ']'
			);
			layout_window.document.getElementById('layout_window_title').innerHTML += (' [' + ct.id.value + '] [' + ct.status.isAllowed + ']'); //todo менять цвет в зависимости от состояния
		}
	} // рисует блок статуса

	init_details_array() { //создаёт объекты Details в массиве (без values) на основе set_details_signature_data

		this.details = [];
		let details_draft = this.init_details_signature_data();

		for (let i = 0; i < pub_details_array_length; i++) {
			this.details.push (
				new Detail(
					(details_draft[i][0]),
					(details_draft[i][1]),
					(details_draft[i][2]),
					(details_draft[i][3]),
					(details_draft[i][4]),
					(details_draft[i][5])
				)
			);
			//Внесение результатов поиcка values в массив объектов Details
			this.details[i].value = helper_get_detail_signature_for_section(this.details[i].section_id, this.details[i].signature);

			if (
				this.details[i].name === 'sender_email'
				||
				this.details[i].name === 'sender_ip'
				){
					this.details[i].value =  helper_find_between(this.details[i].value,'"_blank">','</a>');
				}
		}

	}	//создаёт объекты Detail в массиве (без values) на основе set_details_signature_data TODO Убрать деление на секции, нахуй оно не нужно

	init_options_array () { 				//создаёт объекты Option в массиве ct.options

		this.options = helper_get_options_from_json(this.get_detail_value_by_name("ct_options"));

	}	//создаёт объекты Option в массиве ct.options TODO Добавить сортировку, сначала выводить изменённые

	get_detail_value_by_name(name) { 	//вызывает значения value объекта Detail по имени

		for (let i = 0; i < pub_details_array_length; i++) {

			if (this.details[i].name === name) {
				return this.details[i].value
			}
		}
	} //вызывает значения value объекта Detail по имени

	set_detail_prop_by_name(detail_name,property,new_value) { 	//вызывает значения value объекта Detail по имени

		for (let i = 0; i < pub_details_array_length; i++) {

			if (this.details[i].name === detail_name) {

				switch (property) {

					case 'css_id':{
						this.details[i].css_id = new_value;
					} break;

					case 'value':{
						this.details[i].value = new_value;
					} break;
				}
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

	) {

		this.options_default = options_default;

	}

	add_to_issues_list(issue,weight) {
		ISSUES.set(issue,weight);
	}


  //todo не отрабатывает post_info для comment type

	init_options_default() { 			//устанавлвает опции по умолчанию

		this.options_default = { // объект опций
			wordpress: '',
			drupal: '',
			joomla: '',
		}
		//берёт массив опций из JSON
		this.options_default.wordpress = helper_get_options_from_json('{"spam_firewall":"1","sfw__anti_flood":"1","sfw__anti_flood__view_limit":"10","sfw__anti_crawler":"1","sfw__anti_crawler_ua":"1","apikey":"9arymagatetu","autoPubRevelantMess":"0","registrations_test":"1","comments_test":"1","contact_forms_test":"1","general_contact_forms_test":"1","wc_checkout_test":"1","wc_register_from_order":"1","search_test":"1","check_external":"0","check_external__capture_buffer":"0","check_internal":"0","disable_comments__all":"0","disable_comments__posts":"0","disable_comments__pages":"0","disable_comments__media":"0","bp_private_messages":"1","check_comments_number":"1","remove_old_spam":"0","remove_comments_links":"0","show_check_links":"1","manage_comments_on_public_page":"0","protect_logged_in":"1","use_ajax":"1","use_static_js_key":"-1","general_postdata_test":"0","set_cookies":"1","set_cookies__sessions":"0","ssl_on":"0","use_buitin_http_api":"1","exclusions__urls":"","exclusions__urls__use_regexp":"0","exclusions__fields":"","exclusions__fields__use_regexp":"0","exclusions__roles":["Administrator"],"show_adminbar":"1","all_time_counter":"0","daily_counter":"0","sfw_counter":"0","user_token":"","collect_details":"0","send_connection_reports":"0","async_js":"0","debug_ajax":"0","gdpr_enabled":"0","gdpr_text":"","store_urls":"1","store_urls__sessions":"1","comment_notify":"1","comment_notify__roles":[],"complete_deactivation":"0","dashboard_widget__show":"1","allow_custom_key":"0","allow_custom_settings":"0","white_label":"0","white_label__hoster_key":"","white_label__plugin_name":"","use_settings_template":"0","use_settings_template_apply_for_new":"0","use_settings_template_apply_for_current":"0","use_settings_template_apply_for_current_list_sites":""}');

	}

	compare_ct_options_with_default_agent(def_options_agent) { //сравнение опций из запроса с опциями по умолчанию

		let changes_array = [];
		if (def_options_agent.length === ct.options.length) { //todo убрать этот блок, оставить только проверку по именам поций

		} else {
			helper.debugMessage('Количество опций не совпало. Ничего страшного, возможно плагин устарел. По умолчанию : ' + def_options_agent.length + ', в запросе = ' + ct.options.length);
		}



		for (let i = 0; i <= def_options_agent.length - 1; i++) {

			const def_value = helper_trim_and_low(def_options_agent[i].value);

			for (let j = 0; j<= ct.options.length -1; j++) {

				const req_value = helper_trim_and_low(ct.options[j].value);

				if ( (def_options_agent[i].name === ct.options[j].name) && ( def_value !== req_value )) {

					changes_array.push(j);
				}
			}
		}


		changes_array.forEach(function (value) { // подсветка изменённых опций
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
		//тут будут другие агенты
	}

	check_details() {

		for (let i=0; i<=ct.details.length-1; i++){

			switch (ct.details[i].name) {

				//EMAIL
				case 'sender_email': {

					if (ct.details[i].value === '') {

						ct.details[i].css_id = 'BAD';
						this.add_to_issues_list('EMAIL передан, но пустой', '3');

					} else if (ct.details[i].value === null) {

						ct.details[i].css_id = 'INCORRECT';
						this.add_to_issues_list('Не смогли определить EMAIL', '10');

					} else if (ct.get_detail_value_by_name('sender_email_is_bl')==2){

						ct.details[i].css_id = 'BAD';

					} else ct.details[i].css_id = 'GOOD';


				} break;

				//JS
				case 'js_status': {

					if (Number(ct.details[i].value) === -1){
						ct.details[i].css_id= 'BAD';
						this.add_to_issues_list('JS отключен в браузере', '3');
						}

					else if (Number(ct.details[i].value) === 1){
						ct.details[i].css_id= 'GOOD';
						}

					else if(Number(ct.details[i].value) === 0){
						ct.details[i].css_id= 'BAD'
						this.add_to_issues_list('Тест JS провален', '3');
						}

					else {
						ct.details[i].css_id= 'INCORRECT';
						this.add_to_issues_list('Не смогли определить JS', '10');
						}
					} break;

				//IP
				case 'sender_ip': {

					if (ct.details[i].value === '') {

						ct.details[i].css_id= 'BAD';
						this.add_to_issues_list('IP адрес пустой', '3');

					} else if (ct.details[i].value === null) {

						ct.details[i].css_id= 'INCORRECT';
						this.add_to_issues_list('Не смогли определить IP адрес', '10');

					} else if (ct.get_detail_value_by_name('sender_ip_is_bl')==2){

					ct.details[i].css_id = 'BAD';

					}
					else ct.details[i].css_id= 'GOOD';

				}break;

				//SUBMIT_TIME
				case 'submit_time': {

					if ( ct.details[i].value === undefined || ct.details[i].value === '' ){
						ct.details[i].css_id= 'INCORRECT';
						this.add_to_issues_list('Не смогли определить SUBMIT_TIME.', '10');
					}

					else if (Number(ct.details[i].value) === 0){
						ct.details[i].css_id= 'BAD';
						this.add_to_issues_list('SUBMIT_TIME = 0. Возможен GREYLISTING', '5');
					}

					else if(Number(ct.details[i].value) === 1){
						ct.details[i].css_id= 'INCORRECT'
						this.add_to_issues_list('SUBMIT_TIME = 1, так быть не должно. Делай тест.', '10');
					}

					else if(1 <= Number(ct.details[i].value) && Number(ct.details[i].value <= 5) ){
						ct.details[i].css_id= 'BAD'
						this.add_to_issues_list('1 <= SUBMIT_TIME < 5, слишком низкий.', '3');
					}

					else if(500 <= Number(ct.details[i].value) && Number(ct.details[i].value) <= 3000){
						ct.details[i].css_id= 'BAD'
						this.add_to_issues_list('3000 > SUBMIT_TIME > 500, многовато.', '3');
					}

					else if(Number(ct.details[i].value) > 3000){
						ct.details[i].css_id= 'BAD'
						this.add_to_issues_list('SUBMIT_TIME > 3000, есть проблемы.', '3');
					}

					else {
						ct.details[i].css_id= 'GOOD';
					}

				} break;

				//COOKIES
				case 'cookies_enabled': {

					if (ct.details[i].value === '' ||
						ct.details[i].value === null) {

						ct.details[i].css_id= 'BAD';
						this.add_to_issues_list('Не смогли определить наличие COOKIES', '3');

					} else if (ct.details[i].value == 0){

						ct.details[i].css_id = 'BAD';
						this.add_to_issues_list('COOKIES отключены', '10');

					}
					else ct.details[i].css_id= 'GOOD';

				}break;

				//GREYLIST
				case 'is_greylisted': {

					if (ct.details[i].value == 1) {

						ct.details[i].css_id= 'BAD';
						this.add_to_issues_list('Сработал GREYLIST. Смотри SUBMIT_TIME.', '3');

					}
					else ct.details[i].value= 'INVISIBLE';

				}break;

				//MOBILE_UA
				case 'is_mobile_ua': {

					if (ct.details[i].value == 1) {

						ct.details[i].css_id= 'GOOD';
						this.add_to_issues_list('USERAGENT - мобильное устройство', '0');

					}
					else ct.details[i].value= 'INVISIBLE';

				}break;

				//PAGE_URL
				case 'page_url': {

					if (ct.details[i].value.includes('.php') ||
						//ct.details[i].value.includes('') ||
						ct.details[i].value.includes('admin') ||
						ct.details[i].value.includes('login')
					){

						ct.details[i].css_id= 'BAD';
						this.add_to_issues_list('Возможен перехват админки, смотри PAGE_URL', '0');

					} else if(ct.details[i].value == '' ||
						ct.details[i].value === null
					){

						ct.details[i].css_id= 'BAD';
						this.add_to_issues_list('Пустой PAGE_URL. Это странно.', '0');

					}
					else ct.details[i].css_id= 'GOOD';

				}break;
			}
		}
	}
}

//==== TEST BLOCK

//==== TEST BLOCK END

//==== DECLARE BLOCK
const CURRENT_VERSIONS = new Map(
	[
		['wordpress','wordpress-51513']
	]
)
let ISSUES = new Map();
let DEBUG_LIST ='';
let extracted_html;
let pub_ip_trimmed;
let pub_details_array_length;
let ct = new CT();

helper = new Helper();
ct.id = new Id();
ct.analysis = new Analysis();
ct.status = new Status();


//==== DECLARE BLOCK END

//==== NON CLASS FUNCTIONS
function helper_find_between(string,left,right){
	let startfrom;
	let endwith;
	for (let i=0; i<string.length; i++){
		if (string.slice(i,i+left.length) === left) {
			startfrom = i+left.length;
		}
		if (string.slice(i,i+right.length) === right) {
			endwith = i;
		}
	}
	return (string.slice(startfrom,endwith))
}

function helper_get_html_section(section_name) { //извлекает html секции по Details.section_id

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

function helper_get_detail_signature_for_section(section_id, signature) { //ищет Detail.value по Detail.signature внутри секции Details.section_id

	const html_section = helper_get_html_section(section_id); // секция определена
	let start_value_position;
	let end_value_position;

	if (html_section.includes(signature)) { // 11- это символы <td>:&nbsp;
		start_value_position = (html_section.indexOf(signature) + signature.length + 11); //стартовая позиция для искомого значения
	} else {
		return 'INVISIBLE';
	}

	for (let i = start_value_position; i <= html_section.length; i++) {
		if ((html_section.slice(i, i + 5)) === '</td>') {
			end_value_position = i; //конечная позиция определена
			break;
		}
	}
	return html_section.slice(start_value_position, end_value_position);

} 	//ищет Detail.value по Detail.signature внутри секции Details.section_id

function helper_add_tag(position_tag_id, align, html) { // добавляет тег на страницу

	layout_window.document.getElementById(position_tag_id).insertAdjacentHTML(align, html);

} //добавляет тег на страницу

function helper_get_options_from_json(json) { //возвращает массив объектов OPTION из JSON настроек

	const jsonobj = JSON.parse(json);
	let temp = [];
	$.each(jsonobj, function (name, value) {
		temp.push(new Option(name, value, 0))
	})
	return temp;

} //возвращает массив объектов OPTION из JSON настроек

function helper_call_window() { //вызов окна запроса

	//OpenInNewTabWinBrowser('https://www.mail.ru');

	window.layout_window = window.open( // собственно основное окно
		'prefilled.html',
		'_blank');

	layout_window.onload = function () { // действия после загрузки окна

		ct.init_details_array();
		ct.init_options_array();
		ct.analysis.check_details();

		ct.id.init();
		ct.status.init();

		window.pub_strcnt = 0; //счётчик строк в таблице

		ct.draw_details_block();
		ct.draw_options_block();
		ct.draw_status_block();


		ct.analysis.init_options_default();
		ct.analysis.check_options();

		helper.showDebugMsgList();

		layout_window.focus();

	}//вызов окна запроса

} //вызов рабочего окна

function helper_trim_and_low (option_value) { //todo Унести в options_from_json

	let resstring = option_value;
	resstring = resstring.toString().trim();
	resstring = resstring.toLowerCase();
	return (resstring);

}
//==== NON CLASS FUNCTIONS END

//==== LISTENERS
chrome.runtime.onMessage.addListener(function (message) {
	switch (message.command) {

		case "pageHtml":
			extracted_html = message.html;
			helper_call_window();
			break;

		default:
			break;
	}
})

function logHtmlCode(tab) {
	chrome.tabs.executeScript(tab.id, {file: "send-page-code.js"});
}

chrome.browserAction.onClicked.addListener(logHtmlCode);
//==== LISTENERS END

//CODE END
