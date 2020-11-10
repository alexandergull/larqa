/*
    //TODO продолжить вёрстку prefilled
	//TODO парсинг HTML через popup (пока только через ajax по URL могу)
	//TODO анализ данных
*/
class Id {

	constructor(
		url,
		value,
		link_noc,
		link_user
	) {
		this.url = url;
		this.value = value;
		this.link_noc = link_noc;
		this.link_user = link_user;
	}

	get_id_value_from_html() { // берёт request ID из массива HTML

		let signature = `<div class="panel-heading">Запрос `;

		if (extracted_html.includes(signature)) {

			let start_position = ((extracted_html.indexOf(signature) + (signature.length)))

			this.value = (extracted_html.slice(start_position, (parseInt(start_position) + 32)));

		} else

			alert('id.value_init - not found')

	} // берёт request ID из массива HTML

	set_links() { // формирует ссылки на ПУ и на НОК

		if (this.value) {

			this.link_noc = 'https://cleantalk.org/noc/requests?request_id=' + this.value;

			this.link_user = 'https://cleantalk.org/my/show_requests?request_id=' + this.value;

		} else

			alert('id.set_links - no data')

	} //формирует ссылки на ПУ и на НОК

	url_init() {
	}
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
		this.type = type;
	}

	init() {

		if (ct.details) {

			//поиск агента

			this.agent = ct.call_detail_value_by_name('ct_agent');

			console.log('status.init - ct_agent = ' + this.agent);

			//поиск одобрен/нет

			this.isAllowed = ct.call_detail_value_by_name('is_allowed');

			console.log('status.init - is_allowed = ' + this.isAllowed);

			//поиск типа запроса

			switch (ct.call_detail_value_by_name('method_name')) {

				case 'check_newuser':
					this.type = "registration";
					//TODO вот тут можно допилить условия для поиска комментария по comment_type
					break;

				case 'check_message':
					this.type = "comment or contact form";

					break;

				default:
					console.log('status.init - no method_name found');

			}

			this.type = ct.call_detail_value_by_name('is_allowed');

			console.log('status.init - is_allowed = ' + this.isAllowed);

		} else console.log('ct.details - details block not found');


		// поиск значения фильров - тот ещё неморрой
		let signature = `"Добавить в произвольный блок"></span>&nbsp;</td>`;

		let filters_section = html_get_section('filters');

		let start_sec = filters_section.indexOf(signature) + 49;

		let end_sec = null;

		for (let i = start_sec + 1; i <= filters_section.length; i++) {

			if ((filters_section.slice(i, i + 2)) === 'R:') {

				end_sec = i; // конечная позиция определена

				break;
			}
		}

		this.filters = (filters_section.slice(start_sec, end_sec));

		for (let i = 0; i <= this.filters.length; i++) {

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

	misc_show_detail() {
		console.log(
			'detail_name ' + this.name + ' ' +
			'block_id ' + this.block_id + ' ' +
			'signature ' + this.signature + ' ' +
			'value ' + this.value + ' ' +
			'css_id ' + this.css_id + ' ' +
			'section_id ' + this.section_id
		)
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

	set_details_signature_data() { // Установка данных для поиска

		let values = [
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

		let length = (values.length); //длина массива данных для поиска определена

		return [values, length]


	}// ДАННЫЕ!! Установка данных для поиска

	construct_details_block_html() { //конструирует блоки основываясь на Section ID из

		let block_id;

		let ar = [];

		let j;

		let i;

		for (j = 0; j < detail_array_length; j++) {
			ar.push(parseInt(this.details[j].block_id));
		}

		let number_of_blocks = Math.max.apply(null, ar) + 1; //колчество блоков определено

		for (block_id = 0; block_id !== number_of_blocks; block_id++) {

			html_add_tag_to_window('details_table-tbody', 'beforeend', ('<tr id="details_tier_block_' + block_id + '">SECTION ' + block_id + '</tr>'));

			for (i = 0; i < detail_array_length - 1; i++) { //добавление строк

				if (stringcounter <= i) { //хуй знает как это работает и почему без этого не работает

					if (parseInt(this.details[stringcounter].block_id) === block_id) { // добавляем строки если block_id совпал
						stringcounter++;

						if (this.details[stringcounter].name != 'ct_options') {

							html_add_tag_to_window('details_table-tbody', 'beforeend', ('<tr id="details_tier_' + stringcounter + '"></tr>'));

							html_add_tag_to_window(('details_tier_' + stringcounter), 'beforeend', ('<td class="details-name">' + this.details[stringcounter].name + ':</td>'));

							html_add_tag_to_window(('details_tier_' + stringcounter), 'beforeend', ('<td class="details-value">' + this.details[stringcounter].value + '</td>'));

						}

					}

				}

			}

		}

	}//конструирует блоки основываясь на Section ID из set_details_signature_data

	construct_options_block_html() { //конструирует блоки основываясь на Section ID из

		stringcounter = 0;

		html_add_tag_to_window('options_table-tbody', 'beforeend', ('<tr id="options_tier_block></tr>'));

		//alert('this.options.length  ========' + this.options.length);

		for (let i = 0; i < this.options.length; i++) { //добавление строк

			if (stringcounter <= i) { //хуй знает как это работает и почему без этого не работает

				html_add_tag_to_window('options_table-tbody', 'beforeend', ('<tr id="options_tier_' + stringcounter + '"></tr>'));

				html_add_tag_to_window(('options_tier_' + stringcounter), 'beforeend', ('<td class="options-name">' + this.options[stringcounter].name + ':</td>'));

				html_add_tag_to_window(('options_tier_' + stringcounter), 'beforeend', ('<td class="options-value">' + this.options[stringcounter].value + '</td>'));

				stringcounter++;
			}

		}

	}


	set_values_to_details_array() { // Внесение результатов поиcка values в массив объектов Details TODO Убрать нахуй

		console.log('Функция заполнения values для маccива Details начала работать');
		for (let i = 0; i < detail_array_length; i++) {

			this.details[i].value = get_detail_value(this.details[i].section_id, this.details[i].signature);
			//console.log (this.details[i]);
		}
		console.log('Функция заполнения values для маccива Details закончила работать');

	} // вносит результатов поиска values в массив объектов Details

	init_details_array() { //создаёт объекты Details в массиве (без values) на основе set_details_signature_data

		console.log('Создание массива Details началось');

		this.details = [];

		let values = this.set_details_signature_data()[0];

		for (let i = 0; i < detail_array_length; i++) {

			this.details.push(new Detail((values[i][0]), (values[i][1]), (values[i][2]), (values[i][3]), (values[i][4]), (values[i][5])));

		}

		this.set_values_to_details_array();

		console.log('Создание массива Details закончено.');

	} //создаёт объекты Details в массиве (без values)

	init_options_array() { //создаёт объекты Option в массиве ct.options

		console.log('Началась инициация массива Options' + this.call_detail_value_by_name('ct_options'));

		let jsonobj = JSON.parse(this.call_detail_value_by_name("ct_options"));

		var temp = [];

		$.each(jsonobj, function (name, value) {

			temp.push(new Option(name, value, 0))

		})

		this.options = temp;

							console.log('Закончена инициация массива Options');

	}//создаёт объекты Option в массиве ct.options

	call_detail_value_by_name(name) {

							console.log('Ищем значение по:' + name);

		for (let i = 0; i < detail_array_length; i++) {

			if (this.details[i].name === name) {

							console.log('Найдено: ' + this.details[i].value);

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

		//Init class
		this.name = name;
		this.value = value;
		this.priority = priority;

	}

}

class Analysis{

	constructor(

		options_default,
		details_normal_values

	) {

		this.options_default = options_default;
		this.details_normal_values = details_normal_values;
	}

	set_options_default() {

		this.options_default = {
			wordpress: '',
			drupal: '',
			joomla: '',

		}

		let jsonobj = JSON.parse('{"spam_firewall":"1","sfw__anti_flood":"0","sfw__anti_flood__view_limit":"10","sfw__anti_crawler":"0","apikey":"pyme7anenuha","autoPubRevelantMess":"0","registrations_test":"1","comments_test":"1","contact_forms_test":"1","general_contact_forms_test":"1","wc_checkout_test":"1","wc_register_from_order":"1","search_test":"1","check_external":"0","check_external__capture_buffer":"0","check_internal":"0","disable_comments__all":"0","disable_comments__posts":"0","disable_comments__pages":"0","disable_comments__media":"0","bp_private_messages":"1","check_comments_number":"1","remove_old_spam":"0","remove_comments_links":"0","show_check_links":"1","manage_comments_on_public_page":"0","protect_logged_in":"1","use_ajax":"1","use_static_js_key":"-1","general_postdata_test":"0","set_cookies":"1","set_cookies__sessions":"0","ssl_on":"0","use_buitin_http_api":"1","exclusions__urls":"","exclusions__urls__use_regexp":"0","exclusions__fields":"","exclusions__fields__use_regexp":"0","exclusions__roles":["Administrator"],"show_adminbar":"1","all_time_counter":"0","daily_counter":"0","sfw_counter":"0","user_token":"","collect_details":"0","send_connection_reports":"0","async_js":"0","debug_ajax":"0","gdpr_enabled":"0","gdpr_text":"","store_urls":"1","store_urls__sessions":"1","comment_notify":"1","comment_notify__roles":[],"complete_deactivation":"0","dashboard_widget__show":"1","allow_custom_key":"0","allow_custom_settings":"0","white_label":"0","white_label__hoster_key":"","white_label__plugin_name":"","use_settings_template":"0","use_settings_template_apply_for_new":"0","use_settings_template_apply_for_current":"0","use_settings_template_apply_for_current_list_sites":""}');


		var temp = [];

		$.each(jsonobj, function (name, value) {

			temp.push(new Option(name, value, 0))

		})

		this.options_default.wordpress = temp;

										console.log('WORDPRESS OPTIONS DEFAULT' + this.options_default.wordpress);

		for (let i = 0; i<this.options_default.wordpress.length; i++){

				if (this.options_default.wordpress[i].name === ct.options[i].name) {

					console.log( 'yes');
				}
		}
	}
	set_details_normal_values(){

	}

	check_options(){

							/*console.log('DEF OPT TEST 1:' + this.options_default.wordpress[0].name+ ' '
								+ this.options_default.wordpress[0].value + ' '
								+ ct.options[0].name + ' '
								+ ct.options[0].value)*/

		switch (ct.status.agent){

			case 'wordpress-51471': {

				if (this.options_default.wordpress.length === ct.options.length ){

					for (let i=0; i<=this.options_default.wordpress.length - 1; i++){

						if (this.options_default.wordpress[i].value !== ct.options[i].value){ //todo тут нужен trim

									console.log('Difference: '
										+ this.options_default.wordpress[i].name + ' :'
										+ this.options_default.wordpress[i].value + ' '
										+ ct.options[i].value);

						}

					}

				}	else alert('Количество опций не совпало. Проверь агента.');

			}

		}

									console.log('Check options завершена')
	}

	check_details(){

	}


}


//==== TEST BLOCK

//==== TEST BLOCK END

//==== DECLARE BLOCK

let extracted_html = html_init_array(); //забираем HTML

let ct = new CT();

ct.id = new Id();

ct.status = new Status();

ct.analysis = new Analysis();

ct.id.get_id_value_from_html();

ct.id.set_links();

detail_array_length = ct.set_details_signature_data()[1]; // объявляем длину массива объектов Details


//==== DECLARE BLOCK END

//==== NON CLASS FUNCTIONS

function html_get_section(section_name) { //извлекает html секции по Details.section_id

	let signature = `<div class="section_block" data-section="` + section_name + `">`; // подпись берём из параметра функции

	let start_sec = extracted_html.indexOf(signature);// начальная позиция определена

	let end_sec = null;

	for (let i = start_sec + 1; i <= extracted_html.length; i++) {

		if ((extracted_html.slice(i, i + 40)) === '<div class="section_block" data-section=') {

			end_sec = i; // конечная позиция определена

			break;

		}

	}

	return extracted_html.slice(start_sec, end_sec);

} 	//извлекает html секции по Details.section_id

function html_init_array() {

	console.log('HTML extracting started...');

	let extracted_html = `<html class="js" lang="ru"><head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Детализация запроса 2588604be919b38f7c368e43b1fc5edb</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">

        
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="/noc/css/cleantalk_noc.min.css?v24_01_2019_01">
        <style type="text/css">.usd_informer{font-size: 12px;line-height: 15px;padding: 10px 15px;color: #777;text-align: center;margin: 0;}@media (max-width: 1024px){.usd_informer{text-align: left;}}.navbar-nav>li>a, .navbar-nav>li>p{padding-left: 8px;padding-right: 8px;}.navbar-text{margin-right: 8px;margin-left: 8px;}</style>
        <script>(function(H){H.className=H.className.replace(/\bno-js\b/,'js')})(document.documentElement)</script>
    
<script src="/js/helpers/html2canvas.js"></script></head>
<body sip-shortcut-listen="true" data-new-gr-c-s-check-loaded="14.981.0">
<nav class="navbar navbar-default navbar-fixed-top">
    <div class="container-fluid">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icoon-bar"></span>
                <span class="icoon-bar"></span>
                <span class="icoon-bar"></span>
                <span class="glyphicon glyphicon-menu-hamburger"></span>
            </button>
            <a class="navbar-brand" href="/noc">NOC</a>
                        <a class="navbar-brand" href="https://polygon.cleantalk.org/noc/requests?request_id=2588604be919b38f7c368e43b1fc5edb" title="Перейти на полигон"><i class="fa fa-flask" aria-hidden="true"></i></a>
                    </div>
        <div id="navbar" class="collapse navbar-collapse">
            <ul class="nav navbar-nav navbar-left">
                <li><a href="/noc/users">Пользователи</a></li>
                <li><a href="/noc/services">Сайты</a></li>
                <li><a href="/noc/requests">Запросы</a></li>
                <li><a href="/noc/tickets">Обращения</a></li>
                <li><a href="/noc/bills">Счета</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Инструменты <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <h6 class="dropdown-header">Сайт</h6>
                            <li><a href="/noc/blacklists"><i class="fa fa-comments-o" aria-hidden="true"></i> Отзывы</a></li>
                            <li><a href="/noc/antispam-apps"><i class="fa fa-list-alt" aria-hidden="true"></i> Приложения</a></li>
                            <li><a href="/noc/articles"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Статьи</a></li>

                        <h6 class="dropdown-header">Anti-Spam</h6>
                            <li><a href="/noc/filters"><i class="fa fa-filter" aria-hidden="true"></i> Настройки фильтров</a></li>

                        <h6 class="dropdown-header">Security</h6>
                            <li><a href="/noc/file_analysis"><i class="fa fa-search" aria-hidden="true"></i> Анализ подозрительных файлов</a></li>
                            <li><a href="/noc/malware_signatures"><i class="fa fa-bug" aria-hidden="true"></i> Сигнатуры вредоносного кода</a></li>
                            <li><a href="/noc/signatures-upload"><i class="fa fa-cloud-upload" aria-hidden="true"></i> Выгрузка сигнатур</a></li>

                        <h6 class="dropdown-header">Общие</h6>
                            <li><a href="/noc/monitoring"><i class="fa fa-binoculars" aria-hidden="true"></i> Мониторинг</a></li>
                            <li><a href="/noc/postman"><i class="fa fa-envelope-o" aria-hidden="true"></i> Почтовые рассылки</a></li>
                            <li><a href="/noc/remote_calls"><i class="fa fa-globe" aria-hidden="true"></i> Удаленные вызовы</a></li>
                            <li><a href="/noc/ip-networks"><i class="fa fa-link" aria-hidden="true"></i> Управление IP сетями</a></li>
                            <li><a href="/noc/email-blacklists"><i class="fa fa-envelope" aria-hidden="true"></i> Email Blacklists</a></li>
                            <li><a href="/noc/ip-blacklists"><i class="fa fa-list" aria-hidden="true"></i> IP Blacklists</a></li>
                            <li><a href="/noc/pays-notifications"><i class="fa fa-credit-card" aria-hidden="true"></i> Уведомления платежных систем</a></li>
                            <li><a href="/noc/webtm"><i class="fa fa-cogs" aria-hidden="true"></i> WebTM</a></li>

                        <h6 class="dropdown-header">Помощь</h6>
                            <li><a href="/noc/sidemenu" title="Меню help"><i class="fa fa-question" aria-hidden="true"></i> Help</a></li>
                            <li><a href="//docs.cleantalk.org/"><i class="fa fa-wikipedia-w" aria-hidden="true"></i> Wiki</a></li>
                            <li><a href="/noc/docs"><i class="fa fa-book" aria-hidden="true"></i> Документация</a></li>
                    </ul>
                </li>
                <li><a href="/my" title="Панель управления">ПУ</a></li>
                <li class="hidden-xs hidden-sm"><a href="/noc/profile?user_id=351994">galyshev@cleantalk.org</a></li>
            </ul>
        </div>
    </div>
</nav>
<div class="container ">
        <form method="get" id="requests-form">
    <div class="form-group">
        <div class="input-group">
            <input type="text" name="request_id" class="form-control" value="2588604be919b38f7c368e43b1fc5edb" placeholder="Request ID">
            <span class="input-group-btn">
                <button type="submit" class="btn btn-primary">Найти</button>
            </span>
        </div>
    </div>
    </form>


<div class="panel panel-default">
    <div class="panel-heading">Запрос 2588604be919b38f7c368e43b1fc5edb
                    <button class="btn btn-default btn-xs btn-success pull-right disabled" id="save-request" disabled="disabled"><i class="fa fa-floppy-o" aria-hidden="true"></i> <span class="btn-title">Сохранён</span> </button>
            </div>
    <div class="panel-body">
        <table class="table table-hover">
            <tbody>
            <tr>
                <td width="20%">Дата:</td>
                <td>2020-10-25 21:13:00</td>
            </tr>
            <tr>
                <td>Пользователь:</td>
                <td><a href="profile?user_id=558868">wordpress@theboombitfactory.com (558868)</a><a href="/noc/requests?user_id=558868" style="padding-left: 1em">Запросы пользователя</a></td>
            </tr>
            <tr>
                <td>Сайт:</td>
                <td><span data-href="plazatempo.com" onclick="copyToClipboard(event)" title="Адрес в буфер" class="buffer_link">plazatempo.com</span><a href="/noc/requests?service_id=806104" style="padding-left: 2em">Запросы сервиса</a><a href="/noc/filters?service%5B%5D=806104" style="padding-left: 1em">Фильтры сервиса</a></td>
            </tr>
            <tr>
                <td>Ответ сервера:</td>
                <td>*** Forbidden. Sender blacklisted. ulrikebagot3935@adult-work.info : Mail domain for disposable e-mails. Please enable JavaScript.  ***</td>
            </tr>
            <tr>
                <td>Обратная связь:</td>
                                <td>
                    Обратной связи нет
                </td>
                            </tr>
            <tr>
                <td>ID коллектора:</td>
                <td>3</td>
            </tr>
            <tr>
                <td>Запрос в Панели управления пользователя:</td>
                <td>
                                        <a href="http://cleantalk.org/my/show_requests?request_id=2588604be919b38f7c368e43b1fc5edb" target="_blank">http://cleantalk.org/my/show_requests?request_id=2588604be919b38f7c368e43b1fc5edb</a>
                                    </td>
            </tr>
            </tbody>
        </table>
    </div>
</div>
<div class="row">
    <div class="col-sm-12">
        <a href="#team_reply_form" role="button" data-toggle="collapse" aria-expanded="false" aria-controls="team_reply_form">Служебные комментарии (0)</a>
        <br><br>
        <div class="panel panel-default collapse" id="team_reply_form">
            <div class="panel-body">
                <div id="team-replies-box">
                                    </div>
                <form action="" method="post">
                    <textarea id="reply-message" cols="40" class="form-control"></textarea>
                    <br>
                    <button type="button" class="btn btn-default" id="add-reply">Добавить служебный комментарий</button>
                </form>
            </div>
        </div>
    </div>
</div>
<div class="panel panel-default">
    <div class="panel-heading">Детализация запроса</div>
    <div class="panel-body">
        <div class="row">
            <div class="details_navigaion col-xs-10">
                                <a href="#agent" class="block-nav">agent</a>
                                                                                <a href="#blacklist" class="block-nav">blacklist</a>
                                                <a href="#network_by_id" class="block-nav">Network by ID</a>
                                                <a href="#network_by_mask" class="block-nav">Network by Mask</a>
                                                <a href="#details" class="block-nav">details</a>
                                                                                <a href="#filters" class="block-nav">filters</a>
                                                                                <a href="#localcache" class="block-nav">localcache</a>
                                                                                <a href="#params" class="block-nav">params</a>
                                                                                <a href="#response" class="block-nav">response</a>
                                                                                <a href="#sender" class="block-nav">sender</a>
                                                                            </div>
                    </div>
        <div class="request_details" id="request_details"><div class="section_block" data-section="filters"><span class="fa fa-chevron-down order_buttons mode_checkbox" data-direction="down"></span><span class="fa fa-chevron-up order_buttons mode_checkbox" data-direction="up"></span><input class="mode_checkbox section_checkbox" data-section="filters" type="checkbox" checked="">&nbsp;<a id="filters" class="section">filters</a>:<pre><table><tbody><tr class="data_tr" data-section="filters"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="filters" data-record="n_0_wordpress">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>wordpress&nbsp;</td><td>:&nbsp;<a href="#" class="edit_filter">js_disabled</a>:75 <a href="#" class="edit_filter">bl_email_freq</a>:90 <a href="#" class="edit_filter">bl_email_inlist2</a>:100 <a href="#" class="edit_filter">bl_ip_inlist2</a>:100 <a href="#" class="edit_filter">bl_ip_freq</a>:90 <a href="#" class="edit_filter">mail_domain_one_raz</a>:20 R:475</td></tr></tbody></table></pre></div><div class="section_block" data-section="agent" style="display: none;"><span class="fa fa-chevron-down order_buttons mode_checkbox" data-direction="down"></span><span class="fa fa-chevron-up order_buttons mode_checkbox" data-direction="up"></span><input class="mode_checkbox section_checkbox" data-section="agent" type="checkbox">&nbsp;<a id="agent" class="section">agent</a>:<pre><table><tbody><tr class="data_tr" data-section="agent" style="display: none;"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" data-section="agent" data-record="n_0_br_0">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>&nbsp;</td><td>wordpress-51471</td></tr></tbody></table></pre></div><div class="section_block" data-section="custom"><span class="fa fa-chevron-down order_buttons mode_checkbox" data-direction="down"></span><span class="fa fa-chevron-up order_buttons mode_checkbox" data-direction="up"></span><input class="mode_checkbox section_checkbox" data-section="custom" type="checkbox" checked="">&nbsp;<a id="custom" class="section">custom</a>:<pre><table><tbody><tr class="data_tr" data-section="custom"><td class="mode_checkbox"><span class="fa fa-minus delete_record_custom" title="Удалить из произвольного блока" data-record="<b>agent</b> n_0_br_0"></span>&nbsp;</td><td>&nbsp;</td><td>wordpress-51471</td></tr><tr class="data_tr" data-section="custom"><td class="mode_checkbox"><span class="fa fa-minus delete_record_custom" title="Удалить из произвольного блока" data-record="<b>details</b> n_28_method_name"></span>&nbsp;</td><td><b>details</b> method_name&nbsp;</td><td>:&nbsp;check_newuser</td></tr><tr class="data_tr" data-section="custom"><td class="mode_checkbox"><span class="fa fa-minus delete_record_custom" title="Удалить из произвольного блока" data-record="<b>details</b> n_44_service_id"></span>&nbsp;</td><td><b>details</b> service_id&nbsp;</td><td>:&nbsp;806104</td></tr><tr class="data_tr" data-section="custom"><td class="mode_checkbox"><span class="fa fa-minus delete_record_custom" title="Удалить из произвольного блока" data-record="<b>params</b> n_1_all_headers"></span>&nbsp;</td><td><b>params</b> all_headers&nbsp;</td><td>:&nbsp;{"Origin":"https:\/\/www.plazatempo.com","Referer":"https:\/\/www.plazatempo.com\/wp-login.php?action=register","Dnt":"1","Accept-Encoding":"gzip, deflate","Accept-Language":"en-US,en;q=0.5","Accept":"text\/html,application\/xhtml+xml,application\/xml;q=0.9,*\/*;q=0.8","User-Agent":"Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/<a href="http://cleantalk.org/blacklists/66.0.3359.181" target="_blank">66.0.3359.181</a> Safari\/537.36","Content-Type":"application\/x-www-form-urlencoded","Cookie":" apb wordpress_test_cookie=WP+Cookie+check","Content-Length":"126","X-Amzn-Trace-Id":"Root=1-5f95a40b-4254e2c01bb4daa1459aa833","Host":"www.plazatempo.com","X-Forwarded-Port":"443","X-Forwarded-Proto":"https","X-Forwarded-For":"<a href="http://cleantalk.org/blacklists/82.76.234.44" target="_blank">82.76.234.44</a>"}</td></tr><tr class="data_tr" data-section="custom"><td class="mode_checkbox"><span class="fa fa-minus delete_record_custom" title="Удалить из произвольного блока" data-record="<b>params</b> n_5_sender_info"></span>&nbsp;</td><td><b>params</b> sender_info&nbsp;</td><td>:&nbsp;{"plugin_request_id":"<a href="?request_id=c8df7fe7ae8618eca1014eb7124b8007" target="_blank">c8df7fe7ae8618eca1014eb7124b8007</a>","wpms":"no","remote_addr":"<a href="http://cleantalk.org/blacklists/172.26.46.178" target="_blank">172.26.46.178</a>","REFFERRER":"https:\/\/www.plazatempo.com\/wp-login.php?action=register","USER_AGENT":"Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/<a href="http://cleantalk.org/blacklists/66.0.3359.181" target="_blank">66.0.3359.181</a> Safari\/537.36","page_url":"www.plazatempo.com\/wp-login.php?action=register","cms_lang":"es","ct_options":"{\"spam_firewall\":\"1\",\"sfw__anti_flood\":\"0\",\"sfw__anti_flood__view_limit\":\"10\",\"sfw__anti_crawler\":\"0\",\"apikey\":\"vahy4udata9a\",\"autoPubRevelantMess\":\"0\",\"registrations_test\":\"1\",\"comments_test\":\"1\",\"contact_forms_test\":\"1\",\"general_contact_forms_test\":\"1\",\"wc_checkout_test\":\"1\",\"wc_register_from_order\":\"1\",\"search_test\":\"1\",\"check_external\":\"0\",\"check_external__capture_buffer\":\"0\",\"check_internal\":\"0\",\"disable_comments__all\":\"0\",\"disable_comments__posts\":\"0\",\"disable_comments__pages\":\"0\",\"disable_comments__media\":\"0\",\"bp_private_messages\":\"1\",\"check_comments_number\":\"1\",\"remove_old_spam\":\"0\",\"remove_comments_links\":\"0\",\"show_check_links\":\"1\",\"manage_comments_on_public_page\":\"0\",\"protect_logged_in\":\"1\",\"use_ajax\":\"1\",\"use_static_js_key\":\"-1\",\"general_postdata_test\":\"0\",\"set_cookies\":\"1\",\"set_cookies__sessions\":\"0\",\"ssl_on\":\"0\",\"use_buitin_http_api\":\"1\",\"exclusions__urls\":\"\",\"exclusions__urls__use_regexp\":\"0\",\"exclusions__fields\":\"\",\"exclusions__fields__use_regexp\":\"0\",\"exclusions__roles\":[\"Administrator\"],\"show_adminbar\":\"1\",\"all_time_counter\":\"0\",\"daily_counter\":\"0\",\"sfw_counter\":\"0\",\"user_token\":\"\",\"collect_details\":\"0\",\"send_connection_reports\":\"0\",\"async_js\":\"0\",\"debug_ajax\":\"0\",\"gdpr_enabled\":\"0\",\"gdpr_text\":\"\",\"store_urls\":\"1\",\"store_urls__sessions\":\"1\",\"comment_notify\":\"1\",\"comment_notify__roles\":[],\"complete_deactivation\":\"0\",\"dashboard_widget__show\":\"1\",\"allow_custom_key\":\"0\",\"allow_custom_settings\":\"0\",\"white_label\":\"0\",\"white_label__hoster_key\":\"\",\"white_label__plugin_name\":\"\",\"use_settings_template\":\"0\",\"use_settings_template_apply_for_new\":\"0\",\"use_settings_template_apply_for_current\":\"0\",\"use_settings_template_apply_for_current_list_sites\":\"\"}","fields_number":5,"direct_post":0,"checkjs_data_cookies":null,"checkjs_data_post":null,"cookies_enabled":1,"REFFERRER_PREVIOUS":"https:\/\/www.plazatempo.com\/wp-login.php?action=register","site_landing_ts":"1603641687","page_hits":"6","js_info":null,"mouse_cursor_positions":null,"js_timezone":null,"key_press_timestamp":null,"page_set_timestamp":null,"form_visible_inputs":null,"apbct_visible_fields":null,"site_referer":"UNKNOWN","source_url":"{\"www.plazatempo.com\\\/_blog\\\/BIENVENIDOS_A_NUESTRO_BLOG\\\/post\\\/6_Pasos_para_un_CV_exitoso\\\/?page=4879\":[1603641687,1603641929,1603642367],\"www.plazatempo.com\\\/\":[1603641687],\"www.plazatempo.com\\\/wp-login.php?action=register\":[1603642368,1603642368]}","amp_detected":0,"hook":"registration_errors","headers_sent":false,"headers_sent__hook":"no_hook","headers_sent__where":false,"request_type":"POST","post_checkjs_passed":0,"cookie_checkjs_passed":null,"form_validation":"{\"validation_notice\":\"&lt;strong&gt;Error&lt;\\\/strong&gt;: Este correo electr\\u00f3nico ya est\\u00e1 registrado. Por favor, elige otro.\",\"page_url\":\"www.plazatempo.com\\\/wp-login.php?action=register\"}"}</td></tr><tr class="data_tr" data-section="custom"><td class="mode_checkbox"><span class="fa fa-minus delete_record_custom" title="Удалить из произвольного блока" data-record="<b>details</b> n_45_service_id"></span>&nbsp;</td><td><b>details</b> service_id&nbsp;</td><td>:&nbsp;806104</td></tr><tr class="data_tr" data-section="custom"><td class="mode_checkbox"><span class="fa fa-minus delete_record_custom" title="Удалить из произвольного блока" data-record="<b>details</b> n_42_post_url"></span>&nbsp;</td><td><b>details</b> post_url&nbsp;</td><td>:&nbsp;www.plazatempo.com/wp-login.php?action=register</td></tr><tr class="data_tr" data-section="custom"><td class="mode_checkbox"><span class="fa fa-minus delete_record_custom" title="Удалить из произвольного блока" data-record="<b>sender</b> n_21_ip"></span>&nbsp;</td><td><b>sender</b> ip&nbsp;</td><td>:&nbsp;<a href="http://cleantalk.org/blacklists/82.76.234.44" target="_blank">82.76.234.44</a></td></tr><tr class="data_tr" data-section="custom"><td class="mode_checkbox"><span class="fa fa-minus delete_record_custom" title="Удалить из произвольного блока" data-record="<b>sender</b> n_13_email"></span>&nbsp;</td><td><b>sender</b> email&nbsp;</td><td>:&nbsp;<a href="http://cleantalk.org/blacklists/ulrikebagot3935@adult-work.info" target="_blank">ulrikebagot3935@adult-work.info</a></td></tr><tr class="data_tr" data-section="custom"><td class="mode_checkbox"><span class="fa fa-minus delete_record_custom" title="Удалить из произвольного блока" data-record="<b>sender</b> n_45_submit_time"></span>&nbsp;</td><td><b>sender</b> submit_time&nbsp;</td><td>:&nbsp;11</td></tr><tr class="data_tr" data-section="custom"><td class="mode_checkbox"><span class="fa fa-minus delete_record_custom" title="Удалить из произвольного блока" data-record="<b>sender</b> n_46_username"></span>&nbsp;</td><td><b>sender</b> username&nbsp;</td><td>:&nbsp;normandsimos7</td></tr><tr class="data_tr" data-section="custom"><td class="mode_checkbox"><span class="fa fa-minus delete_record_custom" title="Удалить из произвольного блока" data-record="<b>sender</b> n_0_REFFERRER"></span>&nbsp;</td><td><b>sender</b> REFFERRER&nbsp;</td><td>:&nbsp;https://www.plazatempo.com/wp-login.php?action=register</td></tr><tr class="data_tr" data-section="custom"><td class="mode_checkbox"><span class="fa fa-minus delete_record_custom" title="Удалить из произвольного блока" data-record="<b>sender</b> n_1_REFFERRER_PREVIOUS"></span>&nbsp;</td><td><b>sender</b> REFFERRER_PREVIOUS&nbsp;</td><td>:&nbsp;https://www.plazatempo.com/wp-login.php?action=register</td></tr><tr class="data_tr" data-section="custom"><td class="mode_checkbox"><span class="fa fa-minus delete_record_custom" title="Удалить из произвольного блока" data-record="<b>params</b> n_3_js_on"></span>&nbsp;</td><td><b>params</b> js_on&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="custom"><td class="mode_checkbox"><span class="fa fa-minus delete_record_custom" title="Удалить из произвольного блока" data-record="<b>sender</b> n_42_wpms"></span>&nbsp;</td><td><b>sender</b> wpms&nbsp;</td><td>:&nbsp;no</td></tr><tr class="data_tr" data-section="custom"><td class="mode_checkbox"><span class="fa fa-minus delete_record_custom" title="Удалить из произвольного блока" data-record="<b>sender</b> n_4_apbct_visible_fields"></span>&nbsp;</td><td><b>sender</b> apbct_visible_fields&nbsp;</td><td>:&nbsp;</td></tr><tr class="data_tr" data-section="custom"><td class="mode_checkbox"><span class="fa fa-minus delete_record_custom" title="Удалить из произвольного блока" data-record="<b>sender</b> n_9_cookies_enabled"></span>&nbsp;</td><td><b>sender</b> cookies_enabled&nbsp;</td><td>:&nbsp;1</td></tr></tbody></table></pre></div><div class="section_block" data-section="network_by_mask"><span class="fa fa-chevron-down order_buttons mode_checkbox" data-direction="down"></span><span class="fa fa-chevron-up order_buttons mode_checkbox" data-direction="up"></span><input class="mode_checkbox section_checkbox" data-section="network_by_mask" type="checkbox" checked="">&nbsp;<a id="network_by_mask" class="section">network_by_mask</a>:<pre><table><tbody><tr class="data_tr" data-section="network_by_mask"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="network_by_mask" data-record="n_0_Network">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>Network&nbsp;</td><td>:&nbsp;<a href="/noc/ip-networks?network_dec=82.76.232.0/22" target="_blank">82.76.232.0/22</a></td></tr><tr class="data_tr" data-section="network_by_mask"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="network_by_mask" data-record="n_1_Network_type">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>Network_type&nbsp;</td><td>:&nbsp;unknown</td></tr></tbody></table></pre></div><div class="section_block" data-section="blacklist"><span class="fa fa-chevron-down order_buttons mode_checkbox" data-direction="down"></span><span class="fa fa-chevron-up order_buttons mode_checkbox" data-direction="up"></span><input class="mode_checkbox section_checkbox" data-section="blacklist" type="checkbox" checked="">&nbsp;<a id="blacklist" class="section">blacklist</a>:<pre><table><tbody><tr class="data_tr" data-section="blacklist"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="blacklist" data-record="n_0_ip">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>ip&nbsp;</td><td>:&nbsp;<a href="http://cleantalk.org/blacklists/82.76.234.44" target="_blank">82.76.234.44</a><button id="bl_ip" data-ip="82.76.234.44" data-ver="v4" title="Добавить 82.76.234.44 в глобальный BlackList" class="btn btn-default btn-xs btn-danger" style="margin: 0 8px;">Добавить в BL</button></td></tr><tr class="data_tr" data-section="blacklist"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="blacklist" data-record="n_1_email">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>email&nbsp;</td><td>:&nbsp;<a href="http://cleantalk.org/blacklists/ulrikebagot3935@adult-work.info" target="_blank">ulrikebagot3935@adult-work.info</a></td></tr><tr class="data_tr" data-section="blacklist"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="blacklist" data-record="n_2_username">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>username&nbsp;</td><td>:&nbsp;normandsimos7</td></tr><tr class="data_tr" data-section="blacklist"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="blacklist" data-record="n_3_sender_url">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>sender_url&nbsp;</td><td>:&nbsp;</td></tr><tr class="data_tr" data-section="blacklist"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="blacklist" data-record="n_4_website_url">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>website_url&nbsp;</td><td>:&nbsp;plazatempo.com</td></tr><tr class="data_tr" data-section="blacklist"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="blacklist" data-record="n_5_br_0">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>&nbsp;</td><td></td></tr><tr class="data_tr" data-section="blacklist"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="blacklist" data-record="n_5_Blacklists">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>Blacklists&nbsp;</td><td>:&nbsp;</td></tr><tr class="data_tr" data-section="blacklist"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="blacklist" data-record="n_6_ip">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>ip&nbsp;</td><td>:&nbsp;1 (asn_id:0 frequency_10m:12 frequency_1h:32 frequency_24h:130 frequency_all:130 frequency_last:130 frequency_last_all:130 in_list:2 spam_active_asn:0)</td></tr><tr class="data_tr" data-section="blacklist"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="blacklist" data-record="n_7_email">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>email&nbsp;</td><td>:&nbsp;1 (email_exists:EXISTS frequency:177 frequency_10m:4 frequency_1h:2 frequency_24h:25 frequency_all:177 frequency_last:80 frequency_last_all:80 in_list:2)</td></tr><tr class="data_tr" data-section="blacklist"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="blacklist" data-record="n_8_domain">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>domain&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="blacklist"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="blacklist" data-record="n_9_br_0">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>&nbsp;</td><td></td></tr><tr class="data_tr" data-section="blacklist"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="blacklist" data-record="n_9_IP">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>IP&nbsp;</td><td>:&nbsp;in_list = 2.</td></tr><tr class="data_tr" data-section="blacklist"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="blacklist" data-record="n_10_E_mail">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>E_mail&nbsp;</td><td>:&nbsp;in_list = 2.</td></tr></tbody></table></pre></div><div class="section_block" data-section="params"><span class="fa fa-chevron-down order_buttons mode_checkbox" data-direction="down"></span><span class="fa fa-chevron-up order_buttons mode_checkbox" data-direction="up"></span><input class="mode_checkbox section_checkbox" data-section="params" type="checkbox" checked="">&nbsp;<a id="params" class="section">params</a>:<pre><table><tbody><tr class="data_tr" data-section="params"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="params" data-record="n_0_agent">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>agent&nbsp;</td><td>:&nbsp;wordpress-51471</td></tr><tr class="data_tr" data-section="params"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="params" data-record="n_1_all_headers">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>all_headers&nbsp;</td><td>:&nbsp;{"Origin":"https:\/\/www.plazatempo.com","Referer":"https:\/\/www.plazatempo.com\/wp-login.php?action=register","Dnt":"1","Accept-Encoding":"gzip, deflate","Accept-Language":"en-US,en;q=0.5","Accept":"text\/html,application\/xhtml+xml,application\/xml;q=0.9,*\/*;q=0.8","User-Agent":"Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/<a href="http://cleantalk.org/blacklists/66.0.3359.181" target="_blank">66.0.3359.181</a> Safari\/537.36","Content-Type":"application\/x-www-form-urlencoded","Cookie":" apb wordpress_test_cookie=WP+Cookie+check","Content-Length":"126","X-Amzn-Trace-Id":"Root=1-5f95a40b-4254e2c01bb4daa1459aa833","Host":"www.plazatempo.com","X-Forwarded-Port":"443","X-Forwarded-Proto":"https","X-Forwarded-For":"<a href="http://cleantalk.org/blacklists/82.76.234.44" target="_blank">82.76.234.44</a>"}</td></tr><tr class="data_tr" data-section="params"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="params" data-record="n_2_auth_key">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>auth_key&nbsp;</td><td>:&nbsp;vahy4udata9a</td></tr><tr class="data_tr" data-section="params"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="params" data-record="n_3_js_on">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>js_on&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="params"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="params" data-record="n_4_sender_email">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>sender_email&nbsp;</td><td>:&nbsp;<a href="http://cleantalk.org/blacklists/ulrikebagot3935@adult-work.info" target="_blank">ulrikebagot3935@adult-work.info</a></td></tr><tr class="data_tr" data-section="params"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="params" data-record="n_5_sender_info">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>sender_info&nbsp;</td><td>:&nbsp;{"plugin_request_id":"<a href="?request_id=c8df7fe7ae8618eca1014eb7124b8007" target="_blank">c8df7fe7ae8618eca1014eb7124b8007</a>","wpms":"no","remote_addr":"<a href="http://cleantalk.org/blacklists/172.26.46.178" target="_blank">172.26.46.178</a>","REFFERRER":"https:\/\/www.plazatempo.com\/wp-login.php?action=register","USER_AGENT":"Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/<a href="http://cleantalk.org/blacklists/66.0.3359.181" target="_blank">66.0.3359.181</a> Safari\/537.36","page_url":"www.plazatempo.com\/wp-login.php?action=register","cms_lang":"es","ct_options":"{\"spam_firewall\":\"1\",\"sfw__anti_flood\":\"0\",\"sfw__anti_flood__view_limit\":\"10\",\"sfw__anti_crawler\":\"0\",\"apikey\":\"vahy4udata9a\",\"autoPubRevelantMess\":\"0\",\"registrations_test\":\"1\",\"comments_test\":\"1\",\"contact_forms_test\":\"1\",\"general_contact_forms_test\":\"1\",\"wc_checkout_test\":\"1\",\"wc_register_from_order\":\"1\",\"search_test\":\"1\",\"check_external\":\"0\",\"check_external__capture_buffer\":\"0\",\"check_internal\":\"0\",\"disable_comments__all\":\"0\",\"disable_comments__posts\":\"0\",\"disable_comments__pages\":\"0\",\"disable_comments__media\":\"0\",\"bp_private_messages\":\"1\",\"check_comments_number\":\"1\",\"remove_old_spam\":\"0\",\"remove_comments_links\":\"0\",\"show_check_links\":\"1\",\"manage_comments_on_public_page\":\"0\",\"protect_logged_in\":\"1\",\"use_ajax\":\"1\",\"use_static_js_key\":\"-1\",\"general_postdata_test\":\"0\",\"set_cookies\":\"1\",\"set_cookies__sessions\":\"0\",\"ssl_on\":\"0\",\"use_buitin_http_api\":\"1\",\"exclusions__urls\":\"\",\"exclusions__urls__use_regexp\":\"0\",\"exclusions__fields\":\"\",\"exclusions__fields__use_regexp\":\"0\",\"exclusions__roles\":[\"Administrator\"],\"show_adminbar\":\"1\",\"all_time_counter\":\"0\",\"daily_counter\":\"0\",\"sfw_counter\":\"0\",\"user_token\":\"\",\"collect_details\":\"0\",\"send_connection_reports\":\"0\",\"async_js\":\"0\",\"debug_ajax\":\"0\",\"gdpr_enabled\":\"0\",\"gdpr_text\":\"\",\"store_urls\":\"1\",\"store_urls__sessions\":\"1\",\"comment_notify\":\"1\",\"comment_notify__roles\":[],\"complete_deactivation\":\"0\",\"dashboard_widget__show\":\"1\",\"allow_custom_key\":\"0\",\"allow_custom_settings\":\"0\",\"white_label\":\"0\",\"white_label__hoster_key\":\"\",\"white_label__plugin_name\":\"\",\"use_settings_template\":\"0\",\"use_settings_template_apply_for_new\":\"0\",\"use_settings_template_apply_for_current\":\"0\",\"use_settings_template_apply_for_current_list_sites\":\"\"}","fields_number":5,"direct_post":0,"checkjs_data_cookies":null,"checkjs_data_post":null,"cookies_enabled":1,"REFFERRER_PREVIOUS":"https:\/\/www.plazatempo.com\/wp-login.php?action=register","site_landing_ts":"1603641687","page_hits":"6","js_info":null,"mouse_cursor_positions":null,"js_timezone":null,"key_press_timestamp":null,"page_set_timestamp":null,"form_visible_inputs":null,"apbct_visible_fields":null,"site_referer":"UNKNOWN","source_url":"{\"www.plazatempo.com\\\/_blog\\\/BIENVENIDOS_A_NUESTRO_BLOG\\\/post\\\/6_Pasos_para_un_CV_exitoso\\\/?page=4879\":[1603641687,1603641929,1603642367],\"www.plazatempo.com\\\/\":[1603641687],\"www.plazatempo.com\\\/wp-login.php?action=register\":[1603642368,1603642368]}","amp_detected":0,"hook":"registration_errors","headers_sent":false,"headers_sent__hook":"no_hook","headers_sent__where":false,"request_type":"POST","post_checkjs_passed":0,"cookie_checkjs_passed":null,"form_validation":"{\"validation_notice\":\"&lt;strong&gt;Error&lt;\\\/strong&gt;: Este correo electr\\u00f3nico ya est\\u00e1 registrado. Por favor, elige otro.\",\"page_url\":\"www.plazatempo.com\\\/wp-login.php?action=register\"}"}</td></tr><tr class="data_tr" data-section="params"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="params" data-record="n_6_sender_ip">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>sender_ip&nbsp;</td><td>:&nbsp;<a href="http://cleantalk.org/blacklists/82.76.234.44" target="_blank">82.76.234.44</a></td></tr><tr class="data_tr" data-section="params"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="params" data-record="n_7_sender_username">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>sender_username&nbsp;</td><td>:&nbsp;normandsimos7</td></tr><tr class="data_tr" data-section="params"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="params" data-record="n_8_submit_time">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>submit_time&nbsp;</td><td>:&nbsp;11</td></tr><tr class="data_tr" data-section="params"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="params" data-record="n_9_tz">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>tz&nbsp;</td><td>:&nbsp;</td></tr></tbody></table></pre></div><div class="section_block" data-section="response"><span class="fa fa-chevron-down order_buttons mode_checkbox" data-direction="down"></span><span class="fa fa-chevron-up order_buttons mode_checkbox" data-direction="up"></span><input class="mode_checkbox section_checkbox" data-section="response" type="checkbox">&nbsp;<a id="response" class="section">response</a>:<pre><table><tbody><tr class="data_tr" data-section="response"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="response" data-record="n_0_account_status">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>account_status&nbsp;</td><td>:&nbsp;1</td></tr><tr class="data_tr" data-section="response"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="response" data-record="n_1_allow">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>allow&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="response"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="response" data-record="n_2_blacklisted">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>blacklisted&nbsp;</td><td>:&nbsp;1</td></tr><tr class="data_tr" data-section="response"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="response" data-record="n_3_codes">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>codes&nbsp;</td><td>:&nbsp;FORBIDDEN BL EMAIL_DOMAIN_DISPOSABLE JS_DISABLED</td></tr><tr class="data_tr" data-section="response"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="response" data-record="n_4_comment">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>comment&nbsp;</td><td>:&nbsp;*** Forbidden. Sender blacklisted. <a href="http://cleantalk.org/blacklists/ulrikebagot3935@adult-work.info" target="_blank">ulrikebagot3935@adult-work.info</a> : Mail domain for disposable e-mails. Please enable JavaScript.  ***</td></tr><tr class="data_tr" data-section="response"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="response" data-record="n_5_fast_submit">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>fast_submit&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="response" style="display: none;"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" data-section="response" data-record="n_6_id">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>id&nbsp;</td><td>:&nbsp;<a href="?request_id=2588604be919b38f7c368e43b1fc5edb" target="_blank">2588604be919b38f7c368e43b1fc5edb</a></td></tr><tr class="data_tr" data-section="response" style="display: none;"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" data-section="response" data-record="n_7_inactive">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>inactive&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="response"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="response" data-record="n_8_js_disabled">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>js_disabled&nbsp;</td><td>:&nbsp;1</td></tr><tr class="data_tr" data-section="response"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="response" data-record="n_9_version">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>version&nbsp;</td><td>:&nbsp;7.77</td></tr></tbody></table></pre></div><div class="section_block" data-section="sender"><span class="fa fa-chevron-down order_buttons mode_checkbox" data-direction="down"></span><span class="fa fa-chevron-up order_buttons mode_checkbox" data-direction="up"></span><input class="mode_checkbox section_checkbox" data-section="sender" type="checkbox" checked="">&nbsp;<a id="sender" class="section">sender</a>:<pre><table><tbody><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_0_REFFERRER">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>REFFERRER&nbsp;</td><td>:&nbsp;https://www.plazatempo.com/wp-login.php?action=register</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_1_REFFERRER_PREVIOUS">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>REFFERRER_PREVIOUS&nbsp;</td><td>:&nbsp;https://www.plazatempo.com/wp-login.php?action=register</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_2_USER_AGENT">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>USER_AGENT&nbsp;</td><td>:&nbsp;Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/<a href="http://cleantalk.org/blacklists/66.0.3359.181" target="_blank">66.0.3359.181</a> Safari/537.36</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_3_amp_detected">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>amp_detected&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_4_apbct_visible_fields">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>apbct_visible_fields&nbsp;</td><td>:&nbsp;</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_5_checkjs_data_cookies">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>checkjs_data_cookies&nbsp;</td><td>:&nbsp;</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_6_checkjs_data_post">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>checkjs_data_post&nbsp;</td><td>:&nbsp;</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_7_cms_lang">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>cms_lang&nbsp;</td><td>:&nbsp;es</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_8_cookie_checkjs_passed">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>cookie_checkjs_passed&nbsp;</td><td>:&nbsp;</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_9_cookies_enabled">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>cookies_enabled&nbsp;</td><td>:&nbsp;1</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_10_ct_options">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>ct_options&nbsp;</td><td>:&nbsp;{"spam_firewall":"1","sfw__anti_flood":"0","sfw__anti_flood__view_limit":"10","sfw__anti_crawler":"0","apikey":"vahy4udata9a","autoPubRevelantMess":"0","registrations_test":"1","comments_test":"1","contact_forms_test":"1","general_contact_forms_test":"1","wc_checkout_test":"1","wc_register_from_order":"1","search_test":"1","check_external":"0","check_external__capture_buffer":"0","check_internal":"0","disable_comments__all":"0","disable_comments__posts":"0","disable_comments__pages":"0","disable_comments__media":"0","bp_private_messages":"1","check_comments_number":"1","remove_old_spam":"0","remove_comments_links":"0","show_check_links":"1","manage_comments_on_public_page":"0","protect_logged_in":"1","use_ajax":"1","use_static_js_key":"-1","general_postdata_test":"0","set_cookies":"1","set_cookies__sessions":"0","ssl_on":"0","use_buitin_http_api":"1","exclusions__urls":"","exclusions__urls__use_regexp":"0","exclusions__fields":"","exclusions__fields__use_regexp":"0","exclusions__roles":["Administrator"],"show_adminbar":"1","all_time_counter":"0","daily_counter":"0","sfw_counter":"0","user_token":"","collect_details":"0","send_connection_reports":"0","async_js":"0","debug_ajax":"0","gdpr_enabled":"0","gdpr_text":"","store_urls":"1","store_urls__sessions":"1","comment_notify":"1","comment_notify__roles":[],"complete_deactivation":"0","dashboard_widget__show":"1","allow_custom_key":"0","allow_custom_settings":"0","white_label":"0","white_label__hoster_key":"","white_label__plugin_name":"","use_settings_template":"0","use_settings_template_apply_for_new":"0","use_settings_template_apply_for_current":"0","use_settings_template_apply_for_current_list_sites":""}</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_11_direct_post">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>direct_post&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_12_email">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>email&nbsp;</td><td>:&nbsp;<a href="http://cleantalk.org/blacklists/ulrikebagot3935@adult-work.info" target="_blank">ulrikebagot3935@adult-work.info</a></td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_13_fields_number">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>fields_number&nbsp;</td><td>:&nbsp;5</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_14_form_validation">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>form_validation&nbsp;</td><td>:&nbsp;{"validation_notice":"&lt;strong&gt;Error&lt;\/strong&gt;: Este correo electr\u00f3nico ya est\u00e1 registrado. Por favor, elige otro.","page_url":"www.plazatempo.com\/wp-login.php?action=register"}</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_15_form_visible_inputs">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>form_visible_inputs&nbsp;</td><td>:&nbsp;</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_16_headers_sent">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>headers_sent&nbsp;</td><td>:&nbsp;</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_17_headers_sent__hook">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>headers_sent__hook&nbsp;</td><td>:&nbsp;no_hook</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_18_headers_sent__where">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>headers_sent__where&nbsp;</td><td>:&nbsp;</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_19_hook">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>hook&nbsp;</td><td>:&nbsp;registration_errors</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_20_ip">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>ip&nbsp;</td><td>:&nbsp;<a href="http://cleantalk.org/blacklists/82.76.234.44" target="_blank">82.76.234.44</a></td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_21_ip_country">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>ip_country&nbsp;</td><td>:&nbsp;RO</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_22_ip_hostname">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>ip_hostname&nbsp;</td><td>:&nbsp;82-76-234-44.rdsnet.ro</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_23_ipv6">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>ipv6&nbsp;</td><td>:&nbsp;</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_24_js_info">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>js_info&nbsp;</td><td>:&nbsp;</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_25_js_timezone">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>js_timezone&nbsp;</td><td>:&nbsp;</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_26_key_press_timestamp">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>key_press_timestamp&nbsp;</td><td>:&nbsp;</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_27_mouse_cursor_positions">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>mouse_cursor_positions&nbsp;</td><td>:&nbsp;</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_28_page_hits">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>page_hits&nbsp;</td><td>:&nbsp;6</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_29_page_set_timestamp">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>page_set_timestamp&nbsp;</td><td>:&nbsp;</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_30_page_url">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>page_url&nbsp;</td><td>:&nbsp;www.plazatempo.com/wp-login.php?action=register</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_31_plugin_request_id">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>plugin_request_id&nbsp;</td><td>:&nbsp;<a href="?request_id=c8df7fe7ae8618eca1014eb7124b8007" target="_blank">c8df7fe7ae8618eca1014eb7124b8007</a></td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_32_post_checkjs_passed">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>post_checkjs_passed&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_33_remote_addr">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>remote_addr&nbsp;</td><td>:&nbsp;<a href="http://cleantalk.org/blacklists/172.26.46.178" target="_blank">172.26.46.178</a></td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_34_request_type">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>request_type&nbsp;</td><td>:&nbsp;POST</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_35_sender_url">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>sender_url&nbsp;</td><td>:&nbsp;</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_36_site_landing_ts">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>site_landing_ts&nbsp;</td><td>:&nbsp;1603641687</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_37_site_landing_ts_human">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>site_landing_ts_human&nbsp;</td><td>:&nbsp;2020-10-25 21:01:27 - время захода на сайт</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_38_site_referer">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>site_referer&nbsp;</td><td>:&nbsp;UNKNOWN</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_39_site_url">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>site_url&nbsp;</td><td>:&nbsp;</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_40_source_url">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>source_url&nbsp;</td><td>:&nbsp;{"www.plazatempo.com\/_blog\/BIENVENIDOS_A_NUESTRO_BLOG\/post\/6_Pasos_para_un_CV_exitoso\/?page=4879":[1603641687,1603641929,1603642367],"www.plazatempo.com\/":[1603641687],"www.plazatempo.com\/wp-login.php?action=register":[1603642368,1603642368]}</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_41_submit_time">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>submit_time&nbsp;</td><td>:&nbsp;11</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_42_username">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>username&nbsp;</td><td>:&nbsp;normandsimos7</td></tr><tr class="data_tr" data-section="sender"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="sender" data-record="n_43_wpms">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>wpms&nbsp;</td><td>:&nbsp;no</td></tr></tbody></table></pre></div><div class="section_block" data-section="details"><span class="fa fa-chevron-down order_buttons mode_checkbox" data-direction="down"></span><span class="fa fa-chevron-up order_buttons mode_checkbox" data-direction="up"></span><input class="mode_checkbox section_checkbox" data-section="details" type="checkbox" checked="">&nbsp;<a id="details" class="section">details</a>:<pre><table><tbody><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_0_account_status_changed">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>account_status_changed&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_1_admin_countries_auto">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>admin_countries_auto&nbsp;</td><td>:&nbsp;CR</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_2_admin_country">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>admin_country&nbsp;</td><td>:&nbsp;CR</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_3_agent">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>agent&nbsp;</td><td>:&nbsp;wordpress-51471</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_4_allow_to_client">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>allow_to_client&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_5_auth_key">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>auth_key&nbsp;</td><td>:&nbsp;vahy4udata9a</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_6_blacklisted_native">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>blacklisted_native&nbsp;</td><td>:&nbsp;307</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_7_blacklisted_reseted_by_fast_submit">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>blacklisted_reseted_by_fast_submit&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_8_blacklisted_reseted_by_tz">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>blacklisted_reseted_by_tz&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_9_comment_server">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>comment_server&nbsp;</td><td>:&nbsp;*** Forbidden. Sender blacklisted. <a href="http://cleantalk.org/blacklists/ulrikebagot3935@adult-work.info" target="_blank">ulrikebagot3935@adult-work.info</a> : Mail domain for disposable e-mails. Please enable JavaScript. ***</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_10_countries_cluster">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>countries_cluster&nbsp;</td><td>:&nbsp;GB,US</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_11_countries_cluster_global">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>countries_cluster_global&nbsp;</td><td>:&nbsp;PK BD CN IN BR PH NG TR UA VN ID IR</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_12_countries_missmatch">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>countries_missmatch&nbsp;</td><td>:&nbsp;-1</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_13_country_in_cluster">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>country_in_cluster&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_14_email_in_list">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>email_in_list&nbsp;</td><td>:&nbsp;2</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_15_enable_stoplist_db">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>enable_stoplist_db&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_16_filters_subset">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>filters_subset&nbsp;</td><td>:&nbsp;wordpress</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_17_freeze">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>freeze&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_18_grey_list_stop">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>grey_list_stop&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_19_greylist">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>greylist&nbsp;</td><td>:&nbsp;</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_20_ip_in_list">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>ip_in_list&nbsp;</td><td>:&nbsp;2</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_21_is_mobile_UA">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>is_mobile_UA&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_22_is_order">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>is_order&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_23_js_good_agent">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>js_good_agent&nbsp;</td><td>:&nbsp;1</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_24_js_on">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>js_on&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_25_js_passed">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>js_passed&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_26_lang">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>lang&nbsp;</td><td>:&nbsp;en</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_27_lang_db">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>lang_db&nbsp;</td><td>:&nbsp;en</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_28_links">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>links&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_29_logging_restriction">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>logging_restriction&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_30_mail_domain_one_raz">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>mail_domain_one_raz&nbsp;</td><td>:&nbsp;adult-work.info</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_31_mail_user_exist_bl">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>mail_user_exist_bl&nbsp;</td><td>:&nbsp;1</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_32_method_name">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>method_name&nbsp;</td><td>:&nbsp;check_newuser</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_33_min_submit_time">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>min_submit_time&nbsp;</td><td>:&nbsp;3.3333333333333</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_34_moderate">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>moderate&nbsp;</td><td>:&nbsp;1</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_35_most_important_filter">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>most_important_filter&nbsp;</td><td>:&nbsp;bl_email_inlist2</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_36_peer_country">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>peer_country&nbsp;</td><td>:&nbsp;US</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_37_peer_host">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>peer_host&nbsp;</td><td>:&nbsp;<a href="http://cleantalk.org/blacklists/34.239.140.95" target="_blank">34.239.140.95</a></td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_38_post_url">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>post_url&nbsp;</td><td>:&nbsp;www.plazatempo.com/wp-login.php?action=register</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_39_post_url_db">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>post_url_db&nbsp;</td><td>:&nbsp;www.plazatempo.com/wp-login.php?action=register</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_40_private_list_allow">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>private_list_allow&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_41_private_list_deny">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>private_list_deny&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_42_private_list_detected">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>private_list_detected&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_43_process_time">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>process_time&nbsp;</td><td>:&nbsp;0.01923394203186</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_44_registration_type">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>registration_type&nbsp;</td><td>:&nbsp;registration</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_45_sender_ip_from">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>sender_ip_from&nbsp;</td><td>:&nbsp;params</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_46_sender_ip_resolve_mode">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>sender_ip_resolve_mode&nbsp;</td><td>:&nbsp;3</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_47_server_name">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>server_name&nbsp;</td><td>:&nbsp;moderate2.cleantalk.org</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_48_service_id">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>service_id&nbsp;</td><td>:&nbsp;806104</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_49_short_cache_email">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>short_cache_email&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_50_short_cache_ip">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>short_cache_ip&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_51_short_cache_is_spam">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>short_cache_is_spam&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_52_site_country">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>site_country&nbsp;</td><td>:&nbsp;CR US</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_53_site_referer">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>site_referer&nbsp;</td><td>:&nbsp;UNKNOWN</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_54_skip_network">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>skip_network&nbsp;</td><td>:&nbsp;</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_55_skip_tz">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>skip_tz&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_56_sms_number">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>sms_number&nbsp;</td><td>:&nbsp;</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_57_spam_active_asn">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>spam_active_asn&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_58_spam_active_email_domain">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>spam_active_email_domain&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_59_spam_active_network">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>spam_active_network&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_60_submit_time">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>submit_time&nbsp;</td><td>:&nbsp;11</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_61_timestamp">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>timestamp&nbsp;</td><td>:&nbsp;1603642380</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_62_tz">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>tz&nbsp;</td><td>:&nbsp;</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_63_unauthed_allow">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>unauthed_allow&nbsp;</td><td>:&nbsp;0</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_64_user_id">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>user_id&nbsp;</td><td>:&nbsp;558868</td></tr><tr class="data_tr" data-section="details"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="details" data-record="n_65_without_key">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>without_key&nbsp;</td><td>:&nbsp;0</td></tr></tbody></table></pre></div><div class="section_block" data-section="localcache"><span class="fa fa-chevron-down order_buttons mode_checkbox" data-direction="down"></span><span class="fa fa-chevron-up order_buttons mode_checkbox" data-direction="up"></span><input class="mode_checkbox section_checkbox" data-section="localcache" type="checkbox" checked="">&nbsp;<a id="localcache" class="section">localcache</a>:<pre><table><tbody><tr class="data_tr" data-section="localcache"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="localcache" data-record="n_0_email">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>email&nbsp;</td><td>:&nbsp;ulrikebagot3935@adult-work.info	EXISTS	177	4	2	25	177	80	80	2</td></tr><tr class="data_tr" data-section="localcache"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="localcache" data-record="n_1_ip">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>ip&nbsp;</td><td>:&nbsp;0	12	32	130	130	130	130	2	82.76.234.44	0</td></tr></tbody></table></pre></div><div class="section_block" data-section="network_by_id"><span class="fa fa-chevron-down order_buttons mode_checkbox" data-direction="down"></span><span class="fa fa-chevron-up order_buttons mode_checkbox" data-direction="up"></span><input class="mode_checkbox section_checkbox" data-section="network_by_id" type="checkbox" checked="">&nbsp;<a id="network_by_id" class="section">network_by_id</a>:<pre><table><tbody><tr class="data_tr" data-section="network_by_id"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="network_by_id" data-record="n_0_Network">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>Network&nbsp;</td><td>:&nbsp;<a href="/noc/ip-networks?network_dec=" target="_blank"></a></td></tr><tr class="data_tr" data-section="network_by_id"><td class="mode_checkbox"><input class="record_checkbox" type="checkbox" checked="" data-section="network_by_id" data-record="n_1_Network_type">&nbsp;<span class="fa fa-plus add_record_custom" title="Добавить в произвольный блок"></span>&nbsp;</td><td>Network_type&nbsp;</td><td>:&nbsp;</td></tr></tbody></table></pre></div></div>
    </div>
</div>
<button class="template_button" title="Настроить шаблон"><i class="fa fa-bars"></i></button>
<div class="template_menu">
    <div class="row">
        <div class="col-xs-6">
            <select class="form-control" id="templates_list"><option value="0">Шаблоны</option><option value="5">gull</option><option value="7">suppport_1</option><option value="9">support_1</option><option value="11">support_2</option><option value="13">support_3</option><option value="15">AppDev-Safronov1</option><option value="17">Support_4</option><option value="18">Default</option><option value="19">SergeM</option><option value="45">Baburin</option><option value="47">Baburin1</option><option value="49">Baburin2</option><option value="51">lola</option></select>
        </div>
        <div class="col-xs-6">
            <button id="load_template" class="btn btn-info col-xs-12">Загрузить</button>
        </div>
    </div>
    <br>
    <div class="row">
        <div class="col-xs-6">
            <input type="text" class="form-control" id="template_name" placeholder="Имя нового шаблона">
        </div>
        <div class="col-xs-6">
            <button id="save_template" class="btn btn-info col-xs-12">Сохранить</button>
        </div>
    </div>
    <br>
    <div class="row">
        <div class="col-xs-12">
            <button id="reset_template" class="btn btn-info col-xs-12">Сбросить</button>
        </div>
    </div>
    <div class="row">
        <br>
        <div class="col-xs-12">
            <div class="alert template_report">
                <span></span>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="filter_question" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true" class="close_message_report">×</span>
                </button>
                <h4 class="modal-title"></h4>
            </div>
            <div class="modal-body text-center">
                <div id="filter_message">
                </div>
            </div>
            <div class="modal-footer">
                <a id="filter_edit" class="btn btn-info" href="#" target="_blank" title="Перейти">Перейти</a>
                <button type="button" class="btn btn-secondary close_edit" data-dismiss="modal">Отмена</button>
            </div>
        </div>
    </div>
</div>
<style>
    .word_break {
        word-break: break-all;
    }
    td.word_break>a:visited {
        color: grey;
    }
    .div_feedback {
        padding-left: 0 !important;
        float: left;
    }
</style>
<script type="text/javascript">
var smarty_request_id = "2588604be919b38f7c368e43b1fc5edb";
var set_mouse_cursor_positions = false;
var first_name = 'Alex';
var last_name  = 'Gull';
var email = 'galyshev@cleantalk.org';
var user_id = '351994';
</script>
        <div class="container report_block" id="report_block">
        <div class="alert alert-info alert-dismissible text-center col-xs-12">
            <!--<button type="button" class="close close_report"><span aria-hidden="true">&times;</span></button>-->
            <span id="report_message">Report</span>
        </div>
    </div>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
<script src="/noc/js/requests.min.js?v13.05.2020"></script>
<script src="/noc/js/cleantalk.min.js?v14_01_2020_01"></script>
<script src="/noc/js/night_mode.min.js?v14_01_2020_01"></script>
<script src="/noc/js/cleantalk-i18n_ru.min.js"></script>
<div id="error_report_hint">
    Включен режим сообщения об ошибках<br>
    Для выключения: "Ctrl" + "Shift" + "E"<br>
    Статус: <span class="status_error_report">Выделите ошибку</span>
</div>
<div class="modal fade" id="error_message" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true" class="close_message_report">×</span>
                </button>
                <h4 class="modal-title" id="myModalLabel">Сообщение об ошибке</h4>
            </div>
            <div class="modal-body">
                Адресс:<br>
                <span class="report_link">https://cleantalk.org/noc/requests?request_id=2588604be919b38f7c368e43b1fc5edb</span><br><br>
                Вид ошибки:<br>
                <img class="main_error_img img-responsive" src="/files/report_error.png"><br><br>
                Комментарий к ошибке:<br>
                <textarea class="col-md-12 report_comment"></textarea>
            </div>
            <br><br>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary close_message_report" data-dismiss="modal">Отмена</button>
                <button type="button" class="btn btn-primary close_message_report" name="send_message" id="send_message">Отправить</button>
            </div>
        </div>
    </div>
</div>

<button class="night-trigger" title="Выключено"><i class="fa fa-sun-o"></i></button>
<script async="" src="../js/select-error.js?v=04102018_02"></script>

<script>
var night_mode = 'off';
</script>

<style>

    #error_report_hint {
        display: none;
        position: fixed;
        margin-bottom: 0px !important;
        bottom: 10px;
        z-index: 2000;
        right: 10px;
        background-color: rgba(91, 192, 222, 0.5);
        font-size: 10px;
        padding: 5px;
        border: 1px solid black;
        border-radius: 5px;
    }
    .main_error_img {
        border: 1px solid black;
        padding: 10px;
    }
    #navbar .dropdown-header {
        margin-top: 4px;
        margin-bottom: 0px;
}
    }

</style>


</body></html>`;

	console.log('HTML extracted.')
	return extracted_html;
} //извлекает outerHTML

function get_detail_value(section_id, signature) { //ищет Detail.value по Detail.signature внутри секции Details.section_id

	let html_section = html_get_section(section_id); // секция определена

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

function html_add_tag_to_window(position_tag_id, align, html) {
	console.log('TAG COUNSTRUCTS... POS ' + position_tag_id + ' ALGN ' + align + ' HTML ' + html);
	layout_window.document.getElementById(position_tag_id).insertAdjacentHTML(align, html);

} //добавляет тег

function call_layout_window() { //вызов окна запроса


	window.layout_window = window.open( // собственно основное окно
		'prefilled.html',
		'LARQA window',
		'left=50, top=50, width=1000, height=700, status=no, toolbar=no, location=no');

	layout_window.onload = function () { // действия после загрузки окна

		window.stringcounter = 0; //счётчик строк в таблице

		ct.construct_details_block_html(); //собираю таблицу details

		ct.construct_options_block_html(); // собираю таблицу options

	}//вызов окна запроса

}

//==== NON CLASS FUNCTIONS END

//==== DOCUMENT START

window.document.body.onload = function () {

	console.log('Документ загружен');

	document.addEventListener('keyup', function (event) {

		if (event.code == 'KeyA' && (event.shiftKey || event.metaKey)) {

			call_layout_window();

		}

	}); // Горячая клавиша SHIFT+A

	ct.init_details_array();

	//ct.set_values_to_details_array();

	ct.init_options_array();

	ct.status.init();

	ct.analysis.set_options_default();

	ct.analysis.check_options();

	document.getElementById('show_details').onclick = function () {

		call_layout_window();

	}

}

//==== DOCUMENT END


/*window.document.body.onload = function(){

  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    alert(tabs[0].url);

  });


/!*    $.ajax({
      url: "https://cleantalk.org/noc/requests?request_id=0c457eaaf903805f1d143a0d8e74df00",
      success: function (result) {
        alert(result);
      }
    });
    alert ('get_html Onklick event finished')
  }*!/
};*/
