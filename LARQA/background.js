//todo отчёт в буфер обмена
//todo нужен класс фильтров
// нужна обработка кук https://cleantalk.org/noc/requests?request_id=a70392bd8cafdee2289f601962f5b0ff

//*** OPTIONS ***

const HARD_DEBUG = true;
const FILTERS_SORT_DESC = true;
const TIMERS_ENABLED = false;
const DEF_CATS_HIDDEN = {
	"headers":true,
	"message":true,
	"message_decoded":true,
	"subnet":false,
	"debug":true,
};

function initApplicationsData(){

	let apps_map = new Map();

	//WORDPRESS
	apps_map.set('wordpress', new Application(
		{
			"native_number":"wordpress-51525",
			"int_number":"51525"
		},
		true,
		true,
		false,
		`{"spam_firewall":"1","sfw__anti_flood":"1","sfw__anti_flood__view_limit":"20","sfw__anti_crawler":"1","sfw__anti_crawler_ua":"1","apikey":"9arymagatetu","autoPubRevelantMess":"0","registrations_test":"1","comments_test":"1","contact_forms_test":"1","general_contact_forms_test":"1","wc_checkout_test":"1","wc_register_from_order":"1","search_test":"1","check_external":"0","check_external__capture_buffer":"0","check_internal":"0","disable_comments__all":"0","disable_comments__posts":"0","disable_comments__pages":"0","disable_comments__media":"0","bp_private_messages":"1","check_comments_number":"1","remove_old_spam":"0","remove_comments_links":"0","show_check_links":"1","manage_comments_on_public_page":"0","protect_logged_in":"1","use_ajax":"1","use_static_js_key":"-1","general_postdata_test":"0","set_cookies":"1","set_cookies__sessions":"0","ssl_on":"0","use_buitin_http_api":"1","exclusions__urls":"","exclusions__urls__use_regexp":"0","exclusions__fields":"","exclusions__fields__use_regexp":"0","exclusions__roles":["Administrator"],"show_adminbar":"1","all_time_counter":"0","daily_counter":"0","sfw_counter":"0","user_token":"","collect_details":"0","send_connection_reports":"0","async_js":"0","debug_ajax":"0","gdpr_enabled":"0","gdpr_text":"","store_urls":"1","store_urls__sessions":"1","comment_notify":"1","comment_notify__roles":[],"complete_deactivation":"0","dashboard_widget__show":"1","allow_custom_key":"0","allow_custom_settings":"0","white_label":"0","white_label__hoster_key":"","white_label__plugin_name":"","use_settings_template":"0","use_settings_template_apply_for_new":"0","use_settings_template_apply_for_current":"0","use_settings_template_apply_for_current_list_sites":""}`
	))

	//JOOMLA3
	apps_map.set('joomla3', new Application(
		{
			"native_number":"joomla3-62",
			"int_number":"62"
		},
		true,
		false,
		false,
		``
	))

	//JOOMLA4
	apps_map.set('joomla15', new Application(
		{
			"native_number":"joomla15-372",
			"int_number":"372"
		},
		true,
		false,
		false,
		``
	))

	//JOOMLA15
	apps_map.set('joomla3', new Application(
		{
			"native_number":"joomla3-62",
			"int_number":"62"
		},
		true,
		false,
		false,
		``
	))

	//DRUPAL7//070221
	apps_map.set('drupal', new Application(
		{
			"native_number":"drupal-46",
			"int_number":"46"
		},
		true,
		true,
		false,
		`{"access_key":"","cleantalk_check_comments":1,"cleantalk_check_comments_automod":0,"cleantalk_check_comments_min_approved":"3","cleantalk_check_register":1,"cleantalk_check_webforms":0,"cleantalk_check_contact_forms":1,"cleantalk_check_forum_topics":0,"cleantalk_check_ccf":0,"cleantalk_check_search_form":1,"cleantalk_add_search_noindex":0,"cleantalk_url_exclusions":"","cleantalk_url_exclusions_regexp":0,"cleantalk_fields_exclusions":"","cleantalk_roles_exclusions":"4,1,2,12,11","cleantalk_set_cookies":1,"cleantalk_alternative_cookies_session":0,"cleantalk_sfw":0,"cleantalk_ssl":"","cleantalk_link":0}`
	))

	//DRUPAL8
	apps_map.set('drupal8', new Application(
		{
			"native_number":"drupal8-46",
			"int_number":"46"
		},
		true,
		true,
		false,
		``
	))

	//DRUPAL9
	apps_map.set('drupal9', new Application(
		{
			"native_number":"drupal9-15",
			"int_number":"15"
		},
		true,
		true,
		false,
		``
	))

	//UNI
	apps_map.set('uni', new Application(
		{
			"native_number":"uni-23",
			"int_number":"23"
		},
		true,
		true,
		false,
		``
	))

	//PHPBB3
	apps_map.set('phpbb3', new Application(
		{
			"native_number":"ct-phpbb-43",
			"int_number":"43"
		},
		true,
		true,
		false,
		``
	))

	//OPENCART
	apps_map.set('opencart', new Application(
		{
			"native_number":"opencart-21",
			"int_number":"21"
		},
		true,
		true,
		false,
		``
	))

	//PHPBB31
	apps_map.set('phpbb31', new Application(
		{
			"native_number":"phpbb31-573",
			"int_number":"573"
		},
		true,
		true,
		false,
		``
	))

	//IPB
	apps_map.set('ipboard', new Application(
		{
			"native_number":"ipboard-20",
			"int_number":"20"
		},
		true,
		true,
		false,
		``
	))

	//IPS
	apps_map.set('ipboard4', new Application(
		{
			"native_number":"ipboard4-200",
			"int_number":"200"
		},
		true,
		true,
		false,
		``
	))

	//BITRIX
	apps_map.set('bitrix', new Application(
		{
			"native_number":"bitrix-31113",
			"int_number":"31113"
		},
		true,
		true,
		false,
		``
	))

	//SMF//070221
	apps_map.set('smf', new Application(
		{
			"native_number":"smf-231",
			"int_number":"231"
		},
		false,
		false,
		false,
		`NONE`
	))

	//XENFORO
	apps_map.set('xenforo', new Application(
		{
			"native_number":"xenforo-26",
			"int_number":"26"
		},
		true,
		true,
		false,
		``
	))

	//XENFORO2
	apps_map.set('xenforo2', new Application(
		{
			"native_number":"xenforo2-25",
			"int_number":"25"
		},
		true,
		true,
		false,
		``
	))

	//MAGENTO1
	apps_map.set('magento', new Application(
		{
			"native_number":"magento-129",
			"int_number":"129"
		},
		true,
		true,
		false,
		``
	))

	//MAGENTO2
	apps_map.set('magento2', new Application(
		{
			"native_number":"magento2-14",
			"int_number":"14"
		},
		true,
		true,
		false,
		``
	))

	//VBULLETIN4
	apps_map.set('vbulletin', new Application(
		{
			"native_number":"vbulletin-23",
			"int_number":"23"
		},
		true,
		true,
		true,
		``
	))

	//VBULLETIN5
	apps_map.set('vbulletin5', new Application(
		{
			"native_number":"vbulletin5-11",
			"int_number":"11"
		},
		true,
		true,
		true,
		``
	))

	//MYBB
	apps_map.set('mybb', new Application(
		{
			"native_number":"mybb-14",
			"int_number":"14"
		},
		true,
		true,
		true,
		``
	))

	//MODX
	apps_map.set('modx', new Application(
		{
			"native_number":"modx-13",
			"int_number":"13"
		},
		true,
		true,
		true,
		``
	))

	//DLE
	apps_map.set('dle', new Application(
		{
			"native_number":"dle-303",
			"int_number":"303"
		},
		true,
		true,
		true,
		``
	))



	return apps_map;

};

const CAPD_SIGNATURES = ['general_postdata_test','anynewsignature'];

//*** OPTIONS END ***

class Helper {	//Helper class, called to keep misc functionality.

	constructor(

		debug_list,
		issues_list,
		changed_options_list,
		timers,
		exectime,
	) {
		this.debug_list = debug_list;
		this.issues_list = issues_list;
		this.changed_options_list = changed_options_list;
		this.timers = timers;
		this.exectime = exectime;
	}

	initHelperData() {	//Initialize Helper necessary data.

		this.debug_list = '';
		this.issues_list = new Map();
		this.changed_options_list = '';
		this.timers = [];
		this.exectime = 0;

	}

	recordNewTimer(name) {
		if (TIMERS_ENABLED) hl.timers.push(`${name}: ${(performance.now() - this.exectime).toFixed(1)}`);
	}

	startTimer() {
		if (TIMERS_ENABLED) this.exectime = performance.now();
	}

	async ipinfoApiCall() {

		try {

			if (ct.getDetailValueByName('sender_ip') !== '') {

				const request = await fetch(`https://ipinfo.io/${ct.getDetailValueByName('sender_ip')}/json?token=93445218020efd`)
				const json = await request.json()

				let msg = JSON.stringify(json)

				this.addTag('subnets_table_tbody', 'beforeend', `<tr><td class="subnet_table_td--by_what">IPINFO</td><td colspan="3" id="ipinfo-tr">${msg}</td></tr>`);

			}

		} catch (e) {

			alert('STACK ' + e.stack);

		}
	}

	callWindow() {	//Main window call based on "prefilled.html"

		this.initHelperData();

			this.startTimer();

		window.interface_window = window.open('prefilled.html', '_blank');
		interface_window.onload = function() {	// Processes starts here.

			ct.initCTData();

			ct.analysis.initOptionsDefaults();
			ct.status.initStatus();

				hl.recordNewTimer('Init total')
				hl.startTimer();

			ct.analysis.checkDetails();

				hl.recordNewTimer('CheckDetails')
				hl.startTimer();

			ct.analysis.checkOptions();

				hl.recordNewTimer('CheckOptions')
				hl.startTimer();

			ct.drawInterface();

				hl.recordNewTimer('Drawing')
				hl.startTimer();

			hl.ipinfoApiCall();

				hl.recordNewTimer('IpInfo call')
				hl.startTimer();

			hl.showIssuesList();
			hl.showDebugMsgList();
			hl.showChangedOptionsList();

				hl.recordNewTimer('Reports')
				if (TIMERS_ENABLED)
					for (let key in hl.timers){
						hl.addTag('body','afterbegin',`<p style="font-size: 8px">exec time [${hl.timers[key]} ms]</p>`);
				}


			interface_window.focus();

			ct.painter.bindButtons();

		}

	}

	findBetween(string, left, right) { //Return result(str) within string(str) between left(str) and right(str).

		try {

			let start_from = 0;
			let end_with = 0;

			if (!string.includes(left)) {hl.debugMessage(`Left part not found: [${left}] in ${string.slice(0,15)}...`,'findBetween report:')}
			if (!string.includes(right)) {hl.debugMessage(`Right part not found: [${right}] in ${string.slice(0,15)}...`,'findBetween report:')}

			for (let i = 0; i < string.length; i++) {

				if (string.slice(i, i + left.length) === left) {

					start_from = i + left.length;

					for (let j = start_from; j < string.length; j++) {

						if (string.slice(j, j + right.length) === right) {

							end_with = j;
							break;

						}
					}
					break;
				}
			}

				return string.slice(start_from, end_with);

		} catch (e) {
			this.debugMessage(e.stack);
		}

	}

	getHtmlSectionFromEHTML(section_id) { //Returns a HTML section(str) of EXTRACTED_HTML(const:str) by section_name(str), the list of available section_name is in initDetailsSignatureData.Выкл

		if (EXTRACTED_HTML.includes(section_id)) {

			let left = '<div class="section_block" data-section="' + section_id + '">';
			let right;

			if (section_id !== 'message_decoded') {

				right = '<div class="section_block" data-section=';

			} else {

				right = '</td></tr></tbody>';

			}

			return this.findBetween(EXTRACTED_HTML, left, right);

		} else return '';

	}

	getDetailBySignatureInSection(section_id, signature) { //Returns value(str) of Detail by its signature(str) within HTML section of section_id(str)

		const html_section = this.getHtmlSectionFromEHTML(section_id);

		if (!html_section.includes(signature)) {

			return ''

		}

		let left;

		if (section_id!=='message_decoded') {

			left = signature + `<td>:&nbsp;`;

		} else {

			left = signature;

		}

		let right = '</td>';

		return this.findBetween(html_section,left,right)

	}

	addTag(position_tag_id, align, html) { // Adds HTML tag [html:str] to target tag [position_tag_id:str] with alignment [align:str]

		interface_window.document.getElementById(position_tag_id).insertAdjacentHTML(align, html);

	}

	getOptionsFromJSON(json) { //Return array of Option class [array] from JSON string [json:str]

		try {

			const json_obj = JSON.parse(json);
			let parsed_options = [];

			for (let key in json_obj) {
				let value = json_obj[key];
				parsed_options.push(new Option(key, value, 0))
			}

			return parsed_options

		} catch (e) {
			hl.debugMessage(e.stack);
		}
	}

	trimAndLow (option_value) { //Returns trimmed string [return_string:str] in lowercase. Miscellaneous.

		let return_string = option_value;
		return_string = return_string.toString().trim();
		return_string = return_string.toLowerCase();

		return (return_string);

	}

	addToIssuesList(issue,weight) { //Collect new issue [issue:str] and its weight[weight:str] to hl.issues_list

		this.issues_list.set('<p class="report_block-issues">- ' + issue + '</p>',weight);

	}

	showIssuesList() { //Adds a new tag of found issues from [hl.issues_list:map] to Details table

		if(hl.issues_list !=='') {

			let list = '';
			let weight = 0;
			let issues_number = 0;

			for (let entry of this.issues_list.keys()) {
				list += entry;
			}

			for (let entry of this.issues_list.values()) {
				weight += Number(entry);
				issues_number++;
			}

			if (list !== '') {
				hl.addTag('details_table', 'beforebegin', (
					' <div class="report_block"><b>Отчёт аналитики. Обратить внимание: (' + issues_number + ')</b>' + list + '</div>'
				));
			} else {
				hl.addTag('details_table', 'beforebegin', (
					'<div class="report_block" id="details_table-report-block"><b>Отчёт аналитики. Проблемы не обнаружены.</b></div>'
				));
			}
			hl.issues_list = '';
		}

	}

	debugMessage(msg,comment) { //Collects new message [msg:str] to [hl.debug_list:str]. If comment, shows the comment first.

			if (comment) {

				this.debug_list += '\n['+comment+'] ['+msg+']\n';

			} else {

				this.debug_list += '\n['+msg+']\n';

			}

	}

	showDebugMsgList() { //Adds a new tag of found issues from hl.debug_list to Status table

		if (this.debug_list !=='' && HARD_DEBUG ) {
			hl.addTag('status_table-tbody', 'beforebegin', (`

			<div class="hide-show-backplate" id="debug-backplate">
				<button class="hide-show-button" id="hide-show_debug-button">[+] Показать</button><a class="hide-show-caption">Debug data</a>
          	<div id="debug-hider"><textarea readonly id="debug">${this.debug_list}</textarea></div></div>`));

			this.debug_list = '';
		}

	}

	addToChangedOptionsList(opt) { //Collects changed options [opt:str] to [hl.changed_options_list:str].

		this.changed_options_list += ('<p class="report_block-issues">- ' + opt + '</p>');

	}

	showChangedOptionsList() { //Adds a new tag of changed options from hl.changed_options to Options table

		if (this.changed_options_list !==''){

			hl.addTag('options_table',
				'beforebegin',
				('<div class="report_block" id="options_table-report-block"><b>Изменено опций: (' +
					ct.analysis.options_changes_counter +
					')</b>' +
					this.changed_options_list +
					'</div>'
				)
			);

			this.changed_options_list = '';

		} else if (this.changed_options_list === 'INVISIBLE'){

			interface_window.document.getElementById('options_table').hidden = true;

		}

	}

	setInnerHtmlOfTag(tag_id,html_code){ //Shortens code for tag set

		return interface_window.document.getElementById(tag_id).innerHTML=html_code;

	}

	addInnerHtmlToTag(tag_id,html_code){ //Shortens code for tag insert

		return interface_window.document.getElementById(tag_id).innerHTML+=html_code;

	}

}

class Painter{

	bindSHButtonToTag (button_id,tag_id,is_hidden){

		try {

			let button = interface_window.document.getElementById(button_id);

			interface_window.document.getElementById(tag_id).hidden = is_hidden;

			button.innerText = (!is_hidden) ? '[-] Скрыть:' : '[+] Показать:';

			button.onclick = function () {

				let cat_opened = (button.innerText === '[-] Скрыть:');

				interface_window.document.getElementById(tag_id).hidden = !interface_window.document.getElementById(tag_id).hidden;

				if (cat_opened) {

					button.innerText = '[+] Показать:';

				} else {

					button.innerText = '[-] Скрыть:';
					let scroll_to = interface_window.document.getElementById(tag_id).getBoundingClientRect().top;
					interface_window.document.getElementById(tag_id).parentElement.parentElement.parentElement.scrollTo(scroll_to, scroll_to);

				}
			}

		} catch (e) {
			hl.debugMessage(e.stack);
		}
	}

	bindButtons (){

		this.bindSHButtonToTag('hide-show_headers-button','headers_table', DEF_CATS_HIDDEN.headers);
		this.bindSHButtonToTag('hide-show_message_decoded-button','message_decoded-hider', DEF_CATS_HIDDEN.message);
		this.bindSHButtonToTag('hide-show_message_origin-button','message_origin-hider', DEF_CATS_HIDDEN.message_decoded);
		this.bindSHButtonToTag('hide-show_subnet-button','subnets_table', DEF_CATS_HIDDEN.subnet);
		this.bindSHButtonToTag('hide-show_debug-button','debug-hider', DEF_CATS_HIDDEN.debug);

	}

	drawOptionsBlock(ct_options) {	//Draws details block in layout_window

		if (ct_options !== 'INVISIBLE' && ct_options) {
			//Nulls string counter
			let string_counter = 0;
			hl.addTag('options_table-tbody', 'beforeend', ('<tr id="options_tier_block></tr>'));
			for (let i = 0; i < ct_options.length; i++) {

				if (string_counter <= i) {

					hl.addTag('options_table-tbody', 'beforeend', ('<tr id="options_tier_' + string_counter + '"></tr>'));
					hl.addTag(('options_tier_' + string_counter), 'beforeend', ('<td class="options-name">' + ct_options[string_counter].name + ':</td>'));
					hl.addTag(('options_tier_' + string_counter), 'beforeend', ('<td class="options-value">' + ct_options[string_counter].value + '</td>'));

					//Finishes a detail tag
					string_counter++;

				}
			}

		} else {

			hl.addTag('options_table', 'beforebegin', (' <div class="report_block">Вывод опций не поддерживается в этом плагине</div>'));
			interface_window.document.getElementById('options_table').hidden = true;

		}

	}

	drawDetailsBlock(ct_details) {	// Draws details block in layout_window

		try {

			let string_counter = 0;

			let array_of_details = [];

			for (let j = 0; j < ct.details_length; j++) {

				array_of_details.push(parseInt(ct_details[j].block_id));

			}

			//Defines number of blocks
			const number_of_blocks = Math.max.apply(null, array_of_details) + 1;

			//Details block HTML handling
			for (let block_id = 0; block_id !== number_of_blocks; block_id++) {

				for (let i = 0; i < ct.details_length; i++) {

					// Draw a new tag if string counter for a block <= number of details
					if (string_counter <= i) {

						let detail = ct_details[string_counter];

						if (parseInt(detail.block_id) === block_id) {

							// Skip ct_options, this detail is used in options block and should not be shown in details tab.
							if (detail.name !== 'ct_options') {

								if (detail.value !== 'INVISIBLE' && detail.css_id !== 'INVISIBLE') {

									hl.addTag('details_table-tbody', 'beforeend', ('<tr id="details_tier_' + string_counter + '"></tr>'));

									// Special templates for sender IP and sender email to show tools links
									let href = '';
									let ip_additional_hrefs = '';
									let email_additional_hrefs = '';

									// Links to CleanTalk blacklists
									if (detail.name === 'sender_ip' || ct_details[string_counter].name === 'sender_email') {
										href = 'href=https://cleantalk.org/blacklists/' + ct_details[string_counter].value + ' ';
									}

									// Link to all requests contain IP and IPINFO tool
									if (detail.name === 'sender_ip') {
										ip_additional_hrefs = '<a href="https://cleantalk.org/noc/requests?sender_ip=' +
											detail.value +
											'">  [Все запросы с этим IP]  </a><a href="https://ipinfo.io/' +
											detail.value +
											'">  [IPINFO]</a></td>'
									}

									// Link to all requests contains this EMAIL and CleanTalk checker tool
									if (detail.name === 'sender_email') {
										email_additional_hrefs = '<a href="https://cleantalk.org/noc/requests?sender_email=' +
											detail.value +
											'">  [Все запросы с этим EMAIL]  </a><a href="https://cleantalk.org/email-checker/' +
											detail.value +
											'">  [CHECKER]</a></td>'
									}

									// Color detail name and value in accordance with css_id of ct.details containment
									switch (detail.css_id) {

										//BLACK for defaults
										case 'DEFAULT': {
											hl.addTag(('details_tier_' + string_counter),
												'beforeend',
												('<td class="details-name">'
													+ detail.name
													+ ':</td>'));
											hl.addTag(
												('details_tier_' + string_counter),
												'beforeend',
												('<td class="details-value">'
													+ detail.value
													+ '</a>' + ip_additional_hrefs
													+ email_additional_hrefs
													+ '</td>'));
										}
											break;

										//CRIMSON for bad values, bad values needs to inspect
										case 'BAD': {

											hl.addTag(('details_tier_' + string_counter),
												'beforeend',
												('<td class="details-name"><a style="color:#C02000">'
													+ detail.name + ':</td>'));

											hl.addTag(
												('details_tier_' + string_counter),
												'beforeend',
												('<td class="details-value"><a ' + href + 'style="color:#C02000">' +
													detail.value
													+ '</a>' + ip_additional_hrefs
													+ email_additional_hrefs
													+ '</td>'));

										}
											break;

										//GREEN for good values
										case 'GOOD': {

											hl.addTag(('details_tier_' + string_counter),
												'beforeend',
												('<td class="details-name"><a style="color:#009000">'
													+ detail.name
													+ ':</a></td>'));

											hl.addTag(
												('details_tier_' + string_counter),
												'beforeend',
												('<td class="details-value"><a '
													+ href
													+ 'style="color:#009000">'
													+ detail.value
													+ '</a>' + ip_additional_hrefs
													+ email_additional_hrefs
													+ '</td>'));

										}
											break;

										//RED for incorrect values, this should be inspected at CleanTalk side
										case 'INCORRECT': {

											hl.addTag(('details_tier_' + string_counter),
												'beforeend',
												('<td class="details-name"><a style="color:#CC0000">'
													+ detail.name
													+ ':</a></td>'));

											hl.addTag(
												('details_tier_' + string_counter),
												'beforeend',
												('<td class="details-value"><a style="color:#CC0000">'
													+ detail.value
													+ '</a>' + ip_additional_hrefs
													+ email_additional_hrefs
													+ '</td>'));

										}
									}
								}
							}
							//Finishes a detail tag
							string_counter++;
						}
					}
				}
			}
		} catch (e) {
			hl.debugMessage(e.stack);
		}
	}

	drawStatusBlock(ct_status) {	//Draws details block in layout_window

		try {

			hl.addInnerHtmlToTag('status_table-filter-raw', (
				'<p>Сайт: <a class="status_table_inner" href="http://' + ct_status.links.to_website + '">' + ct_status.links.to_website + '</a>' +
				', агент: [' + ct_status.agent +
				']</p>'
			));

			hl.addInnerHtmlToTag('status_table-filter-raw', (
				'<p class="status_table_inner">Фильтры (отсортированы по убыванию): ' + ct_status.filters + '</p>'
			));

			hl.addInnerHtmlToTag('status_table-filter-raw', (
				'<p class="status_table_inner">Полезные ссылки: ' +
				'<a href="' + ct_status.links.to_noc + '">[Запрос в НОК] </a>' +
				'<a href="' + ct_status.links.to_dashboard + '">[Запрос в ПУ] </a>' +
				'<a href="' + ct_status.links.to_user_card + '">[Карта пользователя] </a>' +
				'<a href="' + ct_status.links.to_service_requests + '">[Все запросы сервиса] </a>' +
				'<a href="' + ct_status.links.to_user_requests + '">[Все запросы пользователя] </a>' +
				'<a href="' + ct_status.links.to_feedback + '">[Все запросы пользователя c обратной связью] </a>' +
				'</p>'
			));

			//

			ct_status.id_value.short = (
				' ID=..' +
				ct_status.id_value.full.slice(ct_status.id_value.full.length - 5, ct_status.id_value.full.length));

			hl.setInnerHtmlOfTag('layout_window_title', (
				ct_status.id_value.short +
				' [' + ct_status.isAllowed +
				']'
			));

			let header_text;

			if (ct_status.isAllowed === 'ALLOWED') {

				header_text = '<a style="color: #009900">';
				interface_window.document.getElementById('status_block').className = 'is_allowed';

			} else {

				header_text = '<a style="color: #990000">';
				interface_window.document.getElementById('status_block').className = 'is_denied';

			}

			//Draws if Private lists found and triggered
			if (ct_status.isAllowed) {
				header_text += (ct_status.isAllowed === 'ALLOWED') ? 'ALLOWED' : 'DENIED';
				header_text += (+(ct.getDetailValueByName('allowed_by_pl')) === 1) ? ' BY PRIVATE LIST' : '';
				header_text += (+(ct.getDetailValueByName('denied_by_pl')) === 1) ? ' BY PRIVATE LIST' : '';

				hl.addInnerHtmlToTag('status_block-header', (
					'Статус запроса ' +
					'<a href="' + ct_status.links.to_noc + '">' +
					ct_status.id_value.short + '</a>' +
					' ' +
					'<a class="status_header">: ' + header_text + '</a>' +

					//Draws feedback if so.
					'<p style = "text-align: right"> ' + ct_status.feedback + '</p>'
				))
			} else hl.debugMessage('drawStatus failed: no isAllowed found')

		} catch(e) {
			hl.debugMessage(e.stack,'drawStatusBlock FAIL:')
		}
	}

	drawHeadersTable(ct_headers) {

		try {

			let tag_id = 'headers_table_tr-header';

			for (let i = 0; i !== ct_headers.length; i++) {

				if (i > 0) {
					i--;
					tag_id = 'headers_table_tier-' + i;
					i++;
				}

				hl.addTag(tag_id, 'afterend', '<tr id="headers_table_tier-' + i + '"></tr>')
				hl.addTag('headers_table_tier-' + i, 'beforeend', '<td id="headers_table_td-name-' + i + '">' + ct_headers[i].name + '</td>');
				hl.addTag('headers_table_tier-' + i, 'beforeend', '<td id="headers_table_td-value-' + i + '">' + ct_headers[i].value + '</td>');
				hl.addTag('headers_table_tier-' + i, 'beforeend', '<td id="headers_table_td-attention-' + i + '">' + ct_headers[i].is_attention + '</td>');

			}
		} catch (e) {
			hl.debugMessage(e.stack,'drawHeadersTable FAIL:');
		}

	}

	drawMessageTextareas() {

		interface_window.document.getElementById('message_origin-textarea').innerText = ct.getDetailValueByName('message');
		interface_window.document.getElementById('message_decoded-textarea').innerText = ct.getDetailValueByName('message_decoded');

	}

	drawSubnetsTable() {

		try {

			hl.addTag('subnets_table_tr-header', 'afterend',
				'<tr id="subnet_table_tr-name--bytype"></tr>');

			hl.addTag('subnet_table_tr-name--bytype', 'beforeend',
				'<td class="subnet_table_td--by_what" id="subnet_table_th-name-bytype--by_what">BY_TYPE</td>');

			hl.addTag('subnet_table_tr-name--bytype', 'beforeend',
				'<td class="subnet_table_td--network" id="subnet_table_th-name-bytype--network">'+
				ct.getDetailValueByName('network_by_type')+
				'</td>');

			hl.addTag('subnet_table_tr-name--bytype', 'beforeend',
				'<td class="subnet_table_td--type" id="subnet_table_th-name-bytype--type">'+
				ct.getDetailValueByName('type_of_network_by_type')+
				'</td>');

			hl.addTag('subnet_table_tr-name--bytype', 'beforeend',
				'<td class="subnet_table_td--misc" id="subnet_table_th-name-bytype--misc">'+
				'MISC'+
				'</td>');


			hl.addTag('subnet_table_tr-name--bytype', 'afterend',
				'<tr id="subnet_table_tr-name--byid"></tr>');

			hl.addTag('subnet_table_tr-name--byid', 'beforeend',
				'<td class="subnet_table_td--by_what" id="subnet_table_th-name-byid--by_what">BY_ID</td>');

			hl.addTag('subnet_table_tr-name--byid', 'beforeend',
				'<td class="subnet_table_td--network" id="subnet_table_th-name-byid--network">'+
				ct.getDetailValueByName('network_by_id')+
				'</td>');

			hl.addTag('subnet_table_tr-name--byid', 'beforeend',
				'<td class="subnet_table_td--type"id="subnet_table_th-name-byid--type">'+
				ct.getDetailValueByName('type_of_network_by_id')+
				'</td>');

			hl.addTag('subnet_table_tr-name--byid', 'beforeend',
				'<td class="subnet_table_td--misc" id="subnet_table_th-name-byid--misc">'+
				'MISC'+
				'</td>');


			hl.addTag('subnet_table_tr-name--byid', 'afterend',
				'<tr id="subnet_table_tr-name--bymask"></tr>');

			hl.addTag('subnet_table_tr-name--bymask', 'beforeend',
				'<td class="subnet_table_td--by_what" id="subnet_table_th-name-bymask--by_what">BY_MASK</td>');

			hl.addTag('subnet_table_tr-name--bymask', 'beforeend',
				'<td class="subnet_table_td--network" id="subnet_table_th-name-bymask--network">'+
				ct.getDetailValueByName('network_by_mask')+
				'</td>');

			hl.addTag('subnet_table_tr-name--bymask', 'beforeend',
				'<td class="subnet_table_td--type" id="subnet_table_th-name-bymask--type">'+
				ct.getDetailValueByName('type_of_network_by_mask')+
				'</td>');

			hl.addTag('subnet_table_tr-name--bymask', 'beforeend',
				'<td class="subnet_table_td--misc" id="subnet_table_th-name-bymask--misc">'+
				'MISC'+
				'</td>');

		} catch (e) {
			hl.debugMessage(e.stack,'drawSubnetsTable FAIL:');
		}

	}

}

class Status {

	constructor(
		agent,
		isAllowed,
		filters,
		type,
		value,
		feedback,
		links,
		api_calls,
	    user_card
	) {
		this.agent = agent;
		this.isAllowed = isAllowed;
		this.filters = filters;
		this.type = type; //todo допилить status.type
		this.id_value = value;
		this.feedback = feedback;
		this.links = links;
		this.user_card = user_card;
		this.api_calls = api_calls;
	}

	sortFiltersByBalls(order) {	//Sorts filters by dec, expect FILTERS_SORT_DESC
		let filters = ct.status.filters;

		//Slices "service:filter:value,"
		let extracted_values_array = [];
		let f_start = 0;

		for (let i=0;i < filters.length;i++){

			if (filters[i]===' '){

				extracted_values_array.push(filters.slice(f_start,i))
				f_start = i +1;

			}
		}

		//Extracts balls values
		let dots_symbol_index,balls_value;
		let balls_to_sort_array = [];
		let result_string ='';

		for (let i=0;i < extracted_values_array.length;i++) {

			dots_symbol_index = extracted_values_array[i].indexOf(':',extracted_values_array[i].length-6);
			balls_value = extracted_values_array[i].slice(dots_symbol_index+1,extracted_values_array[i].length)

			if (!balls_to_sort_array.includes(balls_value)) {

				balls_to_sort_array.push(balls_value);

			}
		}
		//Sorts balls values
		if (order) {balls_to_sort_array.sort( (a, b) => b - a )} else {balls_to_sort_array.sort( (a, b) => a - b )}

		//Bolds balls values
		let reg_exp;
		let new_eva;
		let temp = '';
		for (let i=0;i < balls_to_sort_array.length;i++) {

			for (let j=0;j < extracted_values_array.length;j++){

				reg_exp = ':'+balls_to_sort_array[i];

				if (extracted_values_array[j].includes(reg_exp)){

					new_eva = extracted_values_array[j].replace(reg_exp,':<b>'+balls_to_sort_array[i]+'</b>');

					if (!temp.includes(extracted_values_array[j])) {

						result_string += new_eva + ' ';
						temp += extracted_values_array[j];

					}

				}
			}
		}

		ct.status.filters = result_string;

	}

	cleanFiltersStringFromTags() {	//Clear [ct.status.filters:str] from tags

			let fstr = ct.status.filters
			for (let i = 0; i <= fstr.length; i++) {

				if (fstr.slice(i, i + 4) === '<td>') {
					fstr = fstr.slice(0, i) + fstr.slice(i + 4, fstr.length)
					i--;
				}

				if (fstr.slice(i, i + 6) === '&nbsp;') {
					fstr = fstr.slice(0, i) + fstr.slice(i + 6, fstr.length)
					i--;
				}

				if (fstr.slice(i, i + 5) === '</td>') {
					fstr = fstr.slice(0, i) + fstr.slice(i + 5, fstr.length)
					i--;
				}

				if (fstr.slice(i, i + 32) === '<a href="#" class="edit_filter">') {
					fstr = fstr.slice(0, i) + fstr.slice(i + 32, fstr.length);
					i--;
				}

				if (fstr.slice(i, i + 4) === '</a>') {
					fstr = fstr.slice(0, i) + fstr.slice(i + 4, fstr.length);
					i--;
				}
			}
			ct.status.filters = fstr;

	}

	colorFiltersNamesIfInSet() {	// Filters highlighting in [ct.status.filter:str]

		let filters = ct.status.filters;

		if (filters != null) {

			let service_or_user_id = '';

			if (filters.includes('service_') || filters.includes('user_')) {

				let start = null;
				let id_regexp;

				for (let i = 0; i < filters.length; i++) {

					if (
						filters.slice(i, i + 8) === 'service_'
						||
						filters.slice(i, i + 5) === 'user_'
					) {
						start = i;
					}

					if (start != null) {

						if (filters[i] === ':') {

							let end = i;

							if (end != null) {
								service_or_user_id = filters.slice(start, end)
								id_regexp = new RegExp(service_or_user_id, 'gi');
								end = 0;
							}

							start = end = null;
							filters = filters.replace(id_regexp, `<a style="color:#990000">` + service_or_user_id + `</a>`);
						}
					}
				}

				hl.addToIssuesList('Для пользователя или сервиса существуют подмножества фильтров.', '0');

			}
		}

		ct.status.filters = filters;
	}

	initFilters() {

		// Extract filters string from HTML
		const left = `"Добавить в произвольный блок"></span>&nbsp;</td><td>`;
		const filters_section = hl.getHtmlSectionFromEHTML('filters');
		const right = 'R:';

		this.filters = hl.findBetween(filters_section,left,right);

		let balls_summary = (function(){

			try {

				if (ct.status.filters.includes('R&nbsp;</td><td>:&nbsp;0')) {

					return '0';

				}

				return hl.findBetween(filters_section,' R:','</td>');

			} catch (e) {
				hl.debugMessage(e.stack);
			}
		}())

		this.cleanFiltersStringFromTags();
		this.sortFiltersByBalls(FILTERS_SORT_DESC);
		this.colorFiltersNamesIfInSet();

			if ( +balls_summary < 80 ) {

			ct.status.filters = `<b style="color: green">R: ${balls_summary}</b> [${ct.status.filters}]`;
			ct.status.filters += `<p>Не хватает для блокировки: <b>${80-balls_summary}</b>, `;

		} else {

			ct.status.filters = `<b style="color: #990000">R: ${balls_summary}</b> [${ct.status.filters}]`;
			ct.status.filters += `<p>Превышено на: <b>${balls_summary-80}</b>, `;

		}

		ct.status.filters += `Настроить: `;
		ct.status.filters += `<a href="${ct.status.links.to_service_filters}">[Фильтры для service_id:${this.user_card.service_id}]</a>, `;
		ct.status.filters += `<a href="${ct.status.links.to_service_filters}">[Фильтры для user_id:${this.user_card.user_id}]</a></p>`;

	}

	initLinks() {

		this.links = {

			to_noc:'',
			to_dashboard:'',
			to_user_card: '',
			to_user_requests:'',
			to_service_requests:'',
			to_feedback:'',
			to_service_filters:'',
			to_user_filters:'',
			to_website:'',

		};

		this.user_card = {

			email:'',
			user_id:'',
			service_id:'',
		};

		this.user_card.user_id = hl.findBetween(EXTRACTED_HTML,'href="profile?user_id=','">');
		this.user_card.email = hl.findBetween(EXTRACTED_HTML,this.user_card.user_id+'">',' (');
		this.user_card.service_id = hl.findBetween(EXTRACTED_HTML,'requests?service_id=','" style=')
		this.links.to_website = hl.findBetween(EXTRACTED_HTML,'<td><span data-href="','" onclick');
		this.links.to_user_card = 'https://cleantalk.org/profile?user_id=' + this.user_card.user_id;
		this.links.to_user_requests = 'https://cleantalk.org/noc/requests?user_id=' + this.user_card.user_id;
		this.links.to_service_requests = 'https://cleantalk.org/noc/requests?service_id=' + this.user_card.service_id;
		this.links.to_feedback = this.links.to_user_requests + '&feedback=on';
		this.links.to_service_filters = 'https://cleantalk.org/noc/filters?service%5B%5D=' + this.user_card.service_id;
		this.links.to_user_filters = 'https://cleantalk.org/noc/filters?user%5B%5D=' + this.user_card.user_id;

		//


	}

	initId() {	// Finds request ID to this.id_value, set this.link_noc and this.link_user

		const signature = `<div class="panel-heading">Запрос `;

		if (EXTRACTED_HTML.includes(signature)) {

			this.id_value = {full:'',short:''};

			const start_position = ( (EXTRACTED_HTML.indexOf(signature) + (signature.length) ) )
			this.id_value.full = (EXTRACTED_HTML.slice (start_position, start_position + 32 ) );

			this.links.to_noc = 'https://cleantalk.org/noc/requests?request_id=' + this.id_value.full;
			this.links.to_dashboard = 'https://cleantalk.org/my/show_requests?request_id=' + this.id_value.full;

		} else hl.debugMessage('ID запроса не найден.');
	}

	initFeedback() { //Extracts feedback from EXTRACTED_HTML.

		const feedback_signature = 'Решение пользователя';

		const feedback_signature_no = `Решение пользователя:
                    </div>
                    <div class="div_feedback col-xs-1">
                        <span class="text-danger">`;

		if (EXTRACTED_HTML.includes(feedback_signature)) {

			this.feedback = EXTRACTED_HTML.includes(feedback_signature);

			const user_dec = hl.findBetween(EXTRACTED_HTML,feedback_signature_no,'</span>');

			this.feedback = (user_dec ==='NO') ? 0:1;

			if (this.feedback === 1) {

				this.feedback = '<a style="color: #009900" >[ Внимание, ОС! -> Одобрено пользователем. ]<a>';

				if (+ct.getDetailValueByName('denied_by_pl')) {

					hl.addToIssuesList('Запрос одобрен пользователем, при этом запись запрещена ЧС. Нужно письмо.','10')

				}

			} else if (this.feedback === 0) {

				this.feedback = '<a style="color: #990000">[ Внимание, ОС! -> запрещено пользователем! ]<a>';

				if (+ct.getDetailValueByName('allowed_by_pl')) {

					hl.addToIssuesList('Запрос запрещён пользователем, при этом запись одобрена ЧС. Нужно письмо.','10');

				}
			}

		} else this.feedback = 'Обратной связи нет.';

	}

	initStatus() { //Init ct.status parameters

			// Names the agent
			this.agent = ct.getDetailValueByName('ct_agent');

			//Checks if the plugin is up-to-date
			/*if (this.agent !== CURRENT_VERSIONS.get('wordpress'))  {

				this.agent = '<a title="Плагин устарел" style  = "color: red">'+this.agent+'</a>';
				hl.addToIssuesList('Версия плагина устарела','3');
				ct.setDetailPropertyByName('ct_agent','css_id','BAD');

			} else {

				this.agent = '<a title="Версия в порядке" style = "color: green">'+this.agent+'</a>';

			}*/

			//Checks if is allowed
			this.isAllowed = (ct.getDetailValueByName('is_allowed') === '1') ? 'ALLOWED' : 'DENIED';

			//Checks request type
			switch (ct.getDetailValueByName('method_name')) {
				case 'check_newuser':
					this.type = "registration";
					//TODO вот тут можно допилить условия для поиска комментария по comment_type
					break;

				case 'check_message':
					this.type = "comment or contact form";
					break;

				default:

			}

//links.user_card.email

		this.initLinks();

		this.initFeedback();

		this.initFilters();

		this.initId();

	}



}

class Application{

	constructor(
		version,
		is_options_supported,
		is_larqa_options_check_supported,
		is_exotic,
		options_defaults,
	) {
		this.version = version;
		this.is_options_supported = is_options_supported;
		this.options_defaults = options_defaults;
		this.is_exotic = is_exotic;
		this.is_larqa_options_check_supported = is_larqa_options_check_supported;
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

class CT {	// Main class CT

	constructor(

		id,
		status,
		details,
		options,
		analysis,
		details_length,
		headers,
		painter

	) {
		this.status = status;
		this.details = details;
		this.options = options;
		this.analysis = analysis;
		this.details_length = details_length;
		this.headers = headers;
		this.painter = painter;
	}

	initDetailsSearchData() {	// Init start search data, returns [][]

		const values = [
			// detail name, block id, signature, reserved, css_id, section to lookup
			['sender_email', '0', '<td>email&nbsp;</td>', '', 'DEFAULT', 'sender'],
			['sender_email_is_bl', '0', '<td>email_in_list&nbsp;</td>', '', 'DEFAULT', 'details'],
			['sender_email_is_sc', '0', '<td>short_cache_email&nbsp;</td>', '', 'DEFAULT', 'details'],
			['sender_email_is_disp', '0', '<td>mail_domain_one_raz&nbsp;</td>', '', 'DEFAULT', 'details'],
			['sender_ip', '1', '<td>ip&nbsp;</td>', '', 'DEFAULT', 'sender'],
			['sender_ip_is_bl', '1', '<td>ip_in_list&nbsp;</td>', '', 'DEFAULT', 'details'],
			['sender_ip_is_sc', '1', '<td>short_cache_ip&nbsp;</td>', '', 'DEFAULT', 'details'],
			['username', '1', '<td>username&nbsp;</td>', '', 'DEFAULT', 'sender'],
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
			['allowed_by_pl', '4', '<td>private_list_allow&nbsp;</td>', '', 'DEFAULT', 'details'],
			['denied_by_pl', '4', '<td>private_list_deny&nbsp;</td>', '', 'DEFAULT', 'details'],
			['pl_has_records', '4', '<td>private_list_detected&nbsp;</td>', '', 'DEFAULT', 'details'],
			['is_allowed', '4', '<td>allow&nbsp;</td>', '', 'DEFAULT', 'response'],
			['method_name', '4', '<td>method_name&nbsp;</td>', '', 'DEFAULT', 'details'],
			['message', '4', '<td>message&nbsp;</td>', '', 'DEFAULT', 'params'],
			['message_decoded', '4', 'title="Добавить в произвольный блок"></span>&nbsp;</td><td></td><td>', '', 'DEFAULT', 'message_decoded'],
			['all_headers', '4', '<td>all_headers&nbsp;</td>', '', 'DEFAULT', 'params'],
			['type_of_network_by_type', '4', '<td>Network_type&nbsp;</td>', '', 'DEFAULT', 'network_by_type'],
			['network_by_type', '4', '<td>Network&nbsp;</td>', '', 'DEFAULT', 'network_by_type'],
			['type_of_network_by_id', '4', '<td>Network_type&nbsp;</td>', '', 'DEFAULT', 'network_by_id'],
			['network_by_id', '4', '<td>Network&nbsp;</td>', '', 'DEFAULT', 'network_by_id'],
			['type_of_network_by_mask', '4', '<td>Network_type&nbsp;</td>', '', 'DEFAULT', 'network_by_mask'],
			['network_by_mask', '4', '<td>Network&nbsp;</td>', '', 'DEFAULT', 'network_by_mask'],

		];

		this.details_length = values.length;

		return values;

	}

	initDetailsArray() {	//Init this.details [array of Detail class]

		// Creates a new array of Detail class
		this.details = [];
		let details_draft = this.initDetailsSearchData();

		try {

			for (let i =0 ; i !== this.details_length ; i++) {

				this.details.push(
					new Detail(
						(details_draft[i][0]),
						(details_draft[i][1]),
						(details_draft[i][2]),
						(details_draft[i][3]),
						(details_draft[i][4]),
						(details_draft[i][5])
					)
				);

				// Set details.values in accordance with initDetailsSearchData result
				this.details[i].value = hl.getDetailBySignatureInSection(this.details[i].section_id, this.details[i].signature);

				// Keep the links from source HTML of sender_email and sender_ip
				if (['sender_ip','sender_email'].includes(this.details[i].name) && this.details[i].value !== '') {
					this.details[i].value =  hl.findBetween(this.details[i].value,'"_blank">','</a>');
				}



					//Messages and headers handling
					if (['message_decoded','message'].includes(this.details[i].name) || this.details[i].name.includes('network')){

						this.details[i].css_id = 'INVISIBLE';

					}

					//Empty values handling
					if (this.details[i].value === '')  this.details[i].css_id = 'INVISIBLE';

			}
		} catch (e) {
			hl.debugMessage(+e.stack);
		}

	}

	initOptionsArray() {	// Init JSON of request options using hl.getOptionsFromJSON and this.getDetailValueByName

		try {

			if (

				['php-api', 'unknown'].includes(ct.getDetailValueByName('ct_agent'))
				||
				this.getDetailValueByName('ct_options') === 'INVISIBLE'
				||
				this.getDetailValueByName('ct_options') === ''
			) {

				hl.debugMessage('initOptionsArray:UNSUPPORTED OPTIONS AGENT');
				this.options = 'INVISIBLE';

			} else {

				this.options = hl.getOptionsFromJSON(this.getDetailValueByName('ct_options'));

			}
		}catch(e){
			hl.debugMessage(e.stack,'initOptionsArray FAIL');
		}
	}

	initHeadersArray() {

		try {

			function escapeSpecialChars(jsonString) {
				return jsonString.replace(/\n/g, "\\n")
					.replace(/\r/g, "\\r")
					.replace(/\t/g, "\\t")
					.replace(/\f/g, "\\f")
					.replace(/<\/a>/g, "")
					.replace(/<a href="\?request_id=/g, ``)
					.replace(/" target="_blank".+?","/g, `\",\"`)
					.replace(/" target="_blank".+?}/g, `\"}`)
					.replace(/<a href="http:\/\/cleantalk.org\/blacklists\//g, "")

			}

			this.headers = [];

			let json_string = this.getDetailValueByName('all_headers');

				//hl.debugMessage(json_string,`json_string origin`);

			json_string = escapeSpecialChars(json_string);

				//hl.debugMessage(json_string,`json_string escaped`);

			const json_obj = JSON.parse(json_string);

			for (let key in json_obj) {
				let value = json_obj[key];
				this.headers.push({
					name: key,
					value: value,
					is_attention: 0
				})
			}

			ct.setDetailPropertyByName('all_headers','css_id','INVISIBLE');

		} catch (e) {
			hl.debugMessage('initHeadersArray() fail: '+e.stack);
		}
	}

	initCTData(){

		this.initDetailsArray();
		this.initOptionsArray();
		this.initHeadersArray();


	}

	drawInterface(){

		this.painter.drawOptionsBlock(this.options);
		this.painter.drawDetailsBlock(this.details);
		this.painter.drawStatusBlock(this.status);
		this.painter.drawHeadersTable(this.headers);
		this.painter.drawMessageTextareas();
		this.painter.drawSubnetsTable();

	}

	getDetailValueByName(name) { 	// Returns a detail value by its name[name:str]

		for (let i = 0; i < this.details_length; i++) {

			if (this.details[i].name === name) {

				return this.details[i].value

			}
		}
		hl.debugMessage(`No detail ${name} found in getDetailValueByName`);
		return '';
	}

	setDetailPropertyByName(detail_name, property, new_value) {	// Set a new property [property:str] value[value:str] in this.details by detail name[detail_name:str]

		for (let i = 0; i < this.details_length; i++) {

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
	}

}

class Option {	// Options class

	constructor(
		name,
		value
	) {

		this.name = name;
		this.value = value;
	}

	paintThis(){

		this.value = `<a style="color:red">${this.value}</a>`;
		this.name = `<a style="color:red">${this.name}</a>`;

	}

	setCAPD(){
		hl.addToIssuesList(`У клиента включена проверка всех постданных: ${this.name}:${this.value}`,`10`);
	}

}

class Analysis {	// Analysis class

	constructor(
		options_default,
		options_changes_counter,
		version_control
	) {
		this.options_default = options_default;
		this.options_changes_counter = options_changes_counter;
		this.applications_data = version_control;
	}

	//todo не отрабатывает post_info для comment type

	initOptionsDefaults() {	//Init object of default options [this.options_default] from specified JSON of options. JSON source sets up manually form current versions of ClenTalk plugins

		try {

			this.applications_data = initApplicationsData();

		} catch (e) {
			hl.debugMessage(e.stack);
		}
	}

	getDefaultOptionsByAgent(ct_agent){

		for (let entry of this.applications_data) {

			if (entry[1].is_options_supported) {

				if (ct_agent.includes(entry[0])) {

					return this.applications_data.get(entry[0]).options_defaults

				}

			} else return false

		}

	}

	findOptionsChanged(default_options) {	//Compares request options with defaults by agent [default_options:str]

		this.options_changes_counter = 0;
		try {
			// Collects options changed
			for (let i = 0; i !== default_options.length; i++) {
				hl.trimAndLow(default_options[i].value)
				const def_value = hl.trimAndLow(default_options[i].value);

				for (let j = 0; j<= ct.options.length -1; j++) {

					let ct_option = ct.options[j]
					const req_value = hl.trimAndLow(ct_option.value);

					if ( (default_options[i].name === ct_option.name) && ( def_value !== req_value ) ) {

						this.options_changes_counter++;
						hl.addToChangedOptionsList(ct_option.name);
						ct_option.paintThis();

					}

					if ( CAPD_SIGNATURES.includes(ct_option.name) ) {
						ct_option.setCAPD();
					}
				}
			}
		} catch (e) {
			hl.debugMessage(e.stack);
		}
	}

	checkOptions() {	// Calls options checking findOptionsChanged

		//todo Дублирование опций обойти https://cleantalk.org/noc/requests?request_id=460ecc492b54f98b5b5bbf26a3629848

		if (this.getDefaultOptionsByAgent(ct.status.agent)) {

			let options_array_from_json = hl.getOptionsFromJSON(this.getDefaultOptionsByAgent(ct.status.agent));
			this.findOptionsChanged(options_array_from_json);

		}

	}

	checkDetails() {	//Checks details, main analysis logic implementation

		if (ct.details) {

			for (let i = 0; i <= ct.details.length - 1; i++) {
				let detail = ct.details[i];
				switch (detail.name) {

					//SHORTCACHES
					case 'sender_email_is_sc': {

						if (Number(detail.value) >= 30) {

							detail.css_id = 'BAD';
							hl.addToIssuesList('EMAIL в шорткэше', '0');

						} else detail.value = 'INVISIBLE';
					}
					break;

					case 'sender_ip_is_sc': {

						if (Number(detail.value) >= 30) {

							detail.css_id = 'BAD';
							hl.addToIssuesList('IP в шорткэше', '0');

						} else detail.value = 'INVISIBLE';
					}
					break;

					//EMAIL
					case 'sender_email': {

						if (detail.value === '') {

							detail.css_id = 'BAD';
							hl.addToIssuesList('EMAIL пустой.', '3');

						} else if (detail.value === null) {

							detail.css_id = 'INCORRECT';
							hl.addToIssuesList('Не смогли определить EMAIL', '10');

						} else if (ct.getDetailValueByName('sender_email_is_bl') === 2) {

							detail.css_id = 'BAD';

						} else detail.css_id = 'GOOD';
					}
					break;

					//JS
					case 'js_status': {

						if (Number(detail.value) === -1) {

							detail.css_id = 'BAD';
							hl.addToIssuesList('JS отключен в браузере', '3');

						} else if (Number(detail.value) === 1) {

							detail.css_id = 'GOOD';

						} else if (Number(detail.value) === 0) {

							detail.css_id = 'BAD'
							hl.addToIssuesList('Тест JS провален', '3');

						} else {

							detail.css_id = 'INCORRECT';
							hl.addToIssuesList('Не смогли определить JS', '10');

						}
					}
					break;

					//IP
					case 'sender_ip': {

						if (detail.value === '') {

							detail.css_id = 'BAD';
							hl.addToIssuesList('IP адрес пустой', '3');

						} else if (detail.value === null) {

							detail.css_id = 'INCORRECT';
							hl.addToIssuesList('Не смогли определить IP адрес', '10');

						} else if (ct.getDetailValueByName('sender_ip_is_bl') === 2) {

							detail.css_id = 'BAD';

						} else detail.css_id = 'GOOD';
					}
					break;

					//REFERRER
					case 'page_referrer': {

						if (detail.value === '') {

							detail.css_id = 'BAD';
							hl.addToIssuesList('REFERRER  пустой', '3');

						} else if (detail.value.includes('google')) {

							detail.css_id = 'BAD';
							hl.addToIssuesList('Поисковик в REFERRER', '10');

						} else detail.css_id = 'GOOD';
					}
					break;

					//PRE-REFERRER
					case 'page_pre_referrer': {

						if (detail.value === '') {

							detail.css_id = 'BAD';
							hl.addToIssuesList('PRE-REFERRER  пустой', '3');

						} else if (detail.value.includes('google')) {

							detail.css_id = 'BAD';
							hl.addToIssuesList('Поисковик в PRE-REFERRER', '10');

						} else detail.css_id = 'GOOD';
					}
					break;

					//SUBMIT_TIME
					case 'submit_time': {

						if (detail.value === undefined || detail.value === '') {

							detail.css_id = 'INCORRECT';
							hl.addToIssuesList('Не смогли определить SUBMIT_TIME.', '10');

						} else if (Number(detail.value) === 0) {

							detail.css_id = 'BAD';
							hl.addToIssuesList('SUBMIT_TIME = 0. Возможен GREYLISTING', '5');

						} else if (Number(detail.value) === 1) {

							detail.css_id = 'INCORRECT'
							hl.addToIssuesList('SUBMIT_TIME = 1, так быть не должно. Делай тест.', '10');

						} else if (1 <= Number(detail.value) && Number(detail.value <= 5)) {

							detail.css_id = 'BAD'
							hl.addToIssuesList('1 <= SUBMIT_TIME < 5, слишком низкий.', '3');

						} else if (500 <= Number(detail.value) && Number(detail.value) <= 3000) {

							detail.css_id = 'BAD'
							hl.addToIssuesList('3000 > SUBMIT_TIME > 500, многовато.', '3');

						} else if (Number(detail.value) > 3000) {

							detail.css_id = 'BAD'
							hl.addToIssuesList('SUBMIT_TIME > 3000, есть проблемы.', '3');

						} else {

							detail.css_id = 'GOOD';

						}

					}
					break;

					//COOKIES
					case 'cookies_enabled': {

						if (detail.value === '' ||
							detail.value === null) {

							detail.css_id = 'BAD';
							hl.addToIssuesList('Не смогли определить наличие COOKIES', '3');

						} else if (detail.value === 0) {

							detail.css_id = 'BAD';
							hl.addToIssuesList('COOKIES отключены', '10');

						} else detail.css_id = 'GOOD';

					}
					break;

					//GREYLIST
					case 'is_greylisted': {

						if (detail.value === 1) {

							detail.css_id = 'BAD';
							hl.addToIssuesList('Сработал GREYLIST. Смотри SUBMIT_TIME.', '3');

						} else detail.value = 'INVISIBLE';

					}
					break;

					//MOBILE_UA
					case 'is_mobile_ua': {

						if (detail.value === 1) {

							detail.css_id = 'GOOD';
							hl.addToIssuesList('USERAGENT - мобильное устройство', '0');

						} else detail.value = 'INVISIBLE';

					}
					break;

					//SENDER_URL
					case 'sender_url': {

						if (detail.value !== '') {

							detail.css_id = 'BAD';
							hl.addToIssuesList('SENDER_URL не пустой. Возможно спам.', '0');

						} else {

							detail.value = 'INVISIBLE';

						}
					}
					break;

					//PAGE_URL and
					case 'page_url': {

						if (detail.value.includes('members') ||
							detail.value.includes('admin') ||
							detail.value.includes('login')
						) {

							detail.css_id = 'BAD';
							hl.addToIssuesList('Возможен перехват админки, смотри PAGE_URL и SENDER_URL', '0');

						} else if (detail.value === '' || detail.value === null) {

							detail.css_id = 'BAD';
							hl.addToIssuesList('Пустой PAGE_URL или SENDER_URL. Это странно, но не более.', '0');

						} else {
							detail.css_id = 'GOOD';

						}
					}
					break;


					//ALLOWED BY PL
					case 'denied_by_pl':
					case 'allowed_by_pl':{

						if (+(detail.value)===1 ){

							if (+(ct.getDetailValueByName('pl_has_records')) === 0){

								detail.css_id = 'INCORRECT';
								hl.addToIssuesList('Сработали записи в персональных списках, но в списках нет записей.', '0');

							} else {

								detail.css_id = 'GOOD';
								hl.addToIssuesList('Сработали записи в персональных списках.', '0');

							}

						} else {

							detail.value = 'INVISIBLE';

						}

					}
					break;

					//MOBILE_UA
					case 'is_allowed': {

						detail.value = 'INVISIBLE';

					}
					break;

					//MOBILE_UA
					case 'pl_has_records': {
						if (+detail.value!==0) {
							detail.css_id = 'GOOD';
						}
						else

							detail.value = 'INVISIBLE';

					}
						break;
				}

			}
		} else hl.debugMessage('ct.checkdetails failed');
	}

}

//*** DECLARE BLOCK ***

let EXTRACTED_HTML;
let ct = new CT();
ct.analysis = new Analysis();
ct.status = new Status();
ct.painter = new Painter();
hl = new Helper();

//*** DECLARE BLOCK END ***

//*** LISTENERS ***


chrome.runtime.onMessage.addListener(function (message) {
		switch (message.command) {

			case "pageHtml":
				EXTRACTED_HTML = message.html;
				hl.callWindow();
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

// ==== DEBUG

