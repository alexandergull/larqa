//todo Допилить проверку параметров
//todo Допилить статус, отображать одобрен\нет, менять цвет в зависимости от этого, отражать allowed by PL

class Helper {	//Helper class, called to keep misc functionality. Canonized

	constructor(

		debug_list,
		issues_list,
		changed_options_list,
	) {
		this.debug_list = debug_list;
		this.issues_list = issues_list;
		this.changed_options_list = changed_options_list;
	}

	initHelperData() {	//Initialize Helper necessary data.

		this.debug_list = '';
		this.issues_list = new Map();
		this.changed_options_list = '';

	}

	hardDebug(msg) {	//Message to layout_window, erases all other window data

		layout_window.document.writeln('<xmp>'+msg+'</xmp>');

	}

	callWindow() {	//Main window call based on "prefilled.html"

		window.layout_window = window.open(
			'prefilled.html',
			'_blank');
		layout_window.onload = function() {	// Processes starts here.
			window.pub_strcnt = 0;

			ct.analysis.initOptionsDefaults();
			ct.initDetailsArray();
			ct.initOptionsArray();
			ct.status.initId();
			ct.status.initStatus();
			ct.analysis.initOptionsDefaults();

			ct.analysis.checkDetails();

			ct.drawDetailsBlock();
			ct.drawOptionsBlock();
			ct.drawStatusBlock();

			ct.analysis.checkOptions();

			helper.showIssuesList();
			helper.showDebugMsgList();
			helper.showChangedOptionsList();
			layout_window.focus();
		}

	}

	findBetween(string, left, right) { //Return result(str) within string(str) between left(str) and right(str).

		let start_from;
		let end_with;

		for (let i=0; i<string.length; i++) {

			if (string.slice(i,i+left.length) === left) {

				start_from = i+left.length+1;
				for (let j=start_from; j<string.length; j++) {
					if (string.slice(j,j+right.length) === right) {
						end_with = j;
						break;
					}
				}
				break;
			}
		}
		return string.slice(start_from,end_with);
	}

	getHtmlSectionFromEHTML(section_id) { //Returns a HTML section(str) of EXTRACTED_HTML(const:str) by section_name(str), the list of available section_name is in initDetailsSignatureData.Выкл

		let left = '<div class="section_block" data-section="' + section_id + '">';
		let right = '<div class="section_block" data-section=';

		return this.findBetween(EXTRACTED_HTML,left,right);

	}

	getDetailBySignatureInSection(section_id, signature) { //Returns value(str) of Detail by its signature(str) within HTML section of section_id(str)

		const html_section = this.getHtmlSectionFromEHTML(section_id);
		if (!html_section.includes(signature)) return 'INVISIBLE';
		let left = signature + '<td>:&nbsp';
		let right = '</td>';
		return this.findBetween(html_section,left,right)

	}

	addTag(position_tag_id, align, html) { // Adds HTML tag [html:str] to target tag [position_tag_id:str] with alignment [align:str]

		layout_window.document.getElementById(position_tag_id).insertAdjacentHTML(align, html);

	}

	getOptionsFromJSON(json) { //Return array of Option class [array] from JSON string [json:str]

		const json_obj = JSON.parse(json);
		let temp = [];

		$.each(json_obj, function (name, value) {
			temp.push(new Option(name, value, 0))
		})

		return temp;

	}

	trimAndLow (option_value) { //Returns trimmed string [return_string:str] in lowercase. Miscellaneous.

		let return_string = option_value;
		return_string = return_string.toString().trim();
		return_string = return_string.toLowerCase();

		return (return_string);

	}

	addToIssuesList(issue,weight) { //Collect new issue [issue:str] and its weight[weight:str] to helper.issues_list

		this.issues_list.set('<p id="debug">- ' + issue + '</p>',weight);

	}

	showIssuesList() { //Adds a new tag of found issues from [helper.issues_list:map] to Details table

		if(helper.issues_list !=='') {

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
				helper.addTag('details_table', 'beforebegin', (
					' <div class="report_block">Обратить внимание!(' + issues_number + '):' + list +
					' <p><b>Итоговый вес: [' + weight + ']</p></b>' +
					' </div>'
				));
			}
		}

	}

	debugMessage(msg,comment) { //Collects new message [msg:str] to [helper.debug_list:str]

		if (comment) {
			this.debug_list += ('[' + comment + ' ]<p id="debug">Debug message: ' + msg + '</p>');
		} else {
			this.debug_list += ('<p id="debug">Debug message: ' + msg + '</p>');
		}

	}

	showDebugMsgList() { //Adds a new tag of found issues from helper.debug_list to Status table

		if (this.debug_list !=='') {
			helper.addTag('status_table-tbody', 'beforeend', ('<tr id="debug"><td>'+this.debug_list+'</td></tr>'));
			this.debug_list = '';
		}

	}

	addToChangedOptionsList(opt) { //Collects changed options [opt:str] to [helper.changed_options_list:str].

		this.changed_options_list += ('<p id="debug">- ' + opt + '</p>');

	}

	showChangedOptionsList() { //Adds a new tag of changed options from helper.changed_options to Options table

		if (this.changed_options_list !==''){
			helper.addTag('options_table', 'beforebegin', ('<div class="report_block" style align="left">Изменены опции:'+this.changed_options_list+'</div>'));
			this.changed_options_list = '';
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
		link_noc,
		link_user
	) {
		this.agent = agent;
		this.isAllowed = isAllowed;
		this.filters = filters;
		this.type = type; //todo допилить status.type
		this.id_value = value;
		this.link_noc = link_noc;
		this.link_user = link_user;
	}

	clearFiltersString() {	//Clear [ct.status.filters:str] from tags

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

	setFiltersColored() {	// Filters highlighting in [ct.status.filter:str]

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

				helper.addToIssuesList('Для пользователя правились фильтры.', '0');

			}
		}

		ct.status.filters = filters;
	}

	initStatus() { //Init ct.status parameters

		if (ct.details) {

			// Names the agent

			this.agent = ct.getDetailValueByName('ct_agent');

			//Checks if the plugin is up-to-date

			if (this.agent !== CURRENT_VERSIONS.get('wordpress'))  {

				this.agent = '<a title="Плагин устарел" style  = "color: red">'+this.agent+'</a>';
				helper.addToIssuesList('Версия плагина устарела','3');
				ct.setDetailPropertyByName('ct_agent','css_id','BAD');

			} else {

				this.agent = '<a title="Версия в порядке" style = "color: green">'+this.agent+'</a>';

			}

			//Checks if is allowed

			this.isAllowed = ct.getDetailValueByName('is_allowed');
			if (this.isAllowed) {this.isAllowed = 'ALLOWED'} else this.isAllowed = 'DENIED';

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

		} else alert('ct.details - details block not found');

		// Extract filters string from HTML

		const left = `"Добавить в произвольный блок"></span>&nbsp;</td><td`;
		const filters_section = helper.getHtmlSectionFromEHTML('filters');
		const right = 'R:';
		this.filters = helper.findBetween(filters_section,left,right);

		//Clear this.filters from tags

		this.clearFiltersString();

	}

	initId() {	// Finds request ID to this.id_value, set this.link_noc and this.link_user

		const signature = `<div class="panel-heading">Запрос `;

		if (EXTRACTED_HTML.includes(signature)) {

			const start_position = ( (EXTRACTED_HTML.indexOf(signature) + (signature.length) ) )
			this.id_value = (EXTRACTED_HTML.slice (start_position, start_position + 32 ) );

			this.link_noc = 'https://cleantalk.org/noc/requests?request_id=' + this.id_value;
			this.link_user = 'https://cleantalk.org/my/show_requests?request_id=' + this.id_value;

		} else helper.debugMessage('ID запроса не найден.');
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
		details_length

	) {
		this.id = id;
		this.status = status;
		this.details = details;
		this.options = options;
		this.analysis = analysis;
		this.details_length = details_length;
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
			['links_detected', '4', '<td>links&nbsp;</td>', '', 'DEFAULT', 'details'],
			['allowed_by_pl', '4', '<td>private_list_allow&nbsp;</td>', '', 'DEFAULT', 'details'],
			['denied_by_pl', '4', '<td>private_list_deny&nbsp;</td>', '', 'DEFAULT', 'details'],
			['pl_has_records', '4', '<td>private_list_detected&nbsp;</td>', '', 'DEFAULT', 'details'],
			['is_allowed', '4', '<td>allow&nbsp;</td>', '', 'DEFAULT', 'response'],
			['method_name', '4', '<td>method_name&nbsp;</td>', '', 'DEFAULT', 'details'],
			['message', '4', '<td>message&nbsp;</td>', '', 'DEFAULT', 'params']
		];

		this.details_length = values.length;

		return values;

	}

	initDetailsArray() {	//Init this.details [array of Detail class]

		// Creates a new array of Detail class
		this.details = [];
		let details_draft = this.initDetailsSearchData();

		for (let i = 0; i < this.details_length; i++) {

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

			// Set details.values in accordance with initDetailsSearchData result
			this.details[i].value = helper.getDetailBySignatureInSection(this.details[i].section_id, this.details[i].signature);

			// Keep the links from source HTML of sender_email and sender_ip
			if (
				this.details[i].name === 'sender_email'
				||
				this.details[i].name === 'sender_ip'
			){
				this.details[i].value =  helper.findBetween(this.details[i].value,'"_blank">','</a>');
			}
		}

	}

	initOptionsArray () {	// Init JSON of request options using helper.getOptionsFromJSON and this.getDetailValueByName

		this.options = helper.getOptionsFromJSON(this.getDetailValueByName("ct_options"));

	}

	drawDetailsBlock() {	// Draws details block in layout_window

		let array_of_details = [];

		for (let j = 0; j < this.details_length; j++) {

			array_of_details.push(parseInt(this.details[j].block_id));

		}

		//Defines number of blocks
		const number_of_blocks = Math.max.apply(null, array_of_details) + 1;

		//Details block HTML handling
		for (let block_id = 0; block_id !== number_of_blocks; block_id++) {

			for (let i = 0; i < this.details_length; i++) {

				// Draw a new tag if string counter for a block <= number of details
				if (pub_strcnt <= i) {

					let detail = this.details[pub_strcnt];

					if (parseInt(detail.block_id) === block_id) {

						// Skip ct_options, this detail is used in options block and should not be shown in details tab.
						if (detail.name !== 'ct_options') {

							helper.addTag('details_table-tbody', 'beforeend', ('<tr id="details_tier_' + pub_strcnt + '"></tr>'));

							if (detail.value !== 'INVISIBLE') {

								// Special templates for sender IP and sender email to show tools links
								let href = '';
								let ip_additional_hrefs = '';
								let email_additional_hrefs = '';

								// Links to CleanTalk blacklists
								if (detail.name === 'sender_ip' || this.details[pub_strcnt].name ==='sender_email') {
									href = 'href=https://cleantalk.org/blacklists/'+ this.details[pub_strcnt].value + ' ';
								}

								// Link to all requests contain IP and IPINFO tool
								if (detail.name === 'sender_ip'){
									ip_additional_hrefs = '<a href="https://cleantalk.org/noc/requests?sender_ip=' +
										detail.value +
										'">  [Все запросы с этим IP]  </a><a href="https://ipinfo.io/' +
										detail.value +
										'">  [IPINFO]</a></td>'
								}

								// Link to all requests contains this EMAIL and CleanTalk checker tool
								if (detail.name === 'sender_email'){
									email_additional_hrefs = '<a href="https://cleantalk.org/noc/requests?sender_email=' +
										detail.value +
										'">  [Все запросы с этим EMAIL]  </a><a href="https://cleantalk.org/email-checker/' +
										detail.value +
										'">  [CHECKER]</a></td>'
								}

								// Color detail name and value in accordance with css_id of ct.details containment
								switch (detail.css_id){

									//BLACK for defaults
									case 'DEFAULT':{
										helper.addTag(('details_tier_' + pub_strcnt),
											'beforeend',
											('<td class="details-name">'
												+ detail.name
												+ ':</td>'));
										helper.addTag(
											('details_tier_' + pub_strcnt),
											'beforeend',
											('<td class="details-value">'
												+ detail.value
												+ '</a>'+ ip_additional_hrefs
												+ email_additional_hrefs +'</td>'));
									} break;

									//CRIMSON for bad values, bad values needs to inspect
									case 'BAD':{

										helper.addTag(('details_tier_' + pub_strcnt),
											'beforeend',
											('<td class="details-name"><a style="color:#C02000">'
												+ detail.name + ':</td>'));

										helper.addTag(
											('details_tier_' + pub_strcnt),
											'beforeend',
											('<td class="details-value"><a '+href+'style="color:#C02000">' +
												detail.value
												+ '</a>'+ ip_additional_hrefs
												+ email_additional_hrefs
												+'</td>'));

									} break;

									//GREEN for good values
									case 'GOOD':{

										helper.addTag(('details_tier_' + pub_strcnt),
											'beforeend',
											('<td class="details-name"><a style="color:#009000">'
												+ detail.name
												+ ':</a></td>'));

										helper.addTag(
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

									//RED for incorrect values, this should be inspected at CleanTalk side
									case 'INCORRECT':{

										helper.addTag(('details_tier_' + pub_strcnt),
											'beforeend',
											('<td class="details-name"><a style="color:#CC0000">'
												+ detail.name
												+ ':</a></td>'));

										helper.addTag(
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
							}
						}
						//Finishes a detail tag
						pub_strcnt++;
					}
				}
			}
		}

	}

	drawOptionsBlock() {	//Draws details block in layout_window

		//Nulls string counter
		window.pub_strcnt = 0;

		helper.addTag('options_table-tbody', 'beforeend', ('<tr id="options_tier_block></tr>'));

		for (let i = 0; i < this.options.length; i++) {

			if (pub_strcnt <= i) {

				helper.addTag('options_table-tbody', 'beforeend', ('<tr id="options_tier_' + pub_strcnt + '"></tr>'));
				helper.addTag(('options_tier_' + pub_strcnt), 'beforeend', ('<td class="options-name">' + this.options[pub_strcnt].name + ':</td>'));
				helper.addTag(('options_tier_' + pub_strcnt), 'beforeend', ('<td class="options-value">' + this.options[pub_strcnt].value + '</td>'));

				//Finishes a detail tag
				pub_strcnt++;

			}
		}

	}

	drawStatusBlock() {	//Draws details block in layout_window todo всё переделать под рисование как в showDebugMessage

		//Calls filters coloring
		ct.status.setFiltersColored();

		layout_window.document.getElementById('status_table_status-class-column').innerHTML += (
			' <p class="status_table_inner">Ссылки на запрос: <a href="' + ct.status.link_noc +'">[НОК] </a>'+
			' <a href="' + ct.status.link_user +'">[ПУ] </a>' +
			' </p>'
		);

		layout_window.document.getElementById('status_table-filter-raw').innerHTML += (
			'Агент: [' + ct.status.agent + '] Фильтры: [' + ct.status.filters + ']'
		);

		layout_window.document.getElementById('layout_window_title').innerHTML = (
			' ID=..' +
			ct.status.id_value.slice(ct.status.id_value.length-5,ct.status.id_value.length) +
			' [' + ct.status.isAllowed +
			']');

		//todo менять цвет блока в зависимости от состояния is_allowed
		//todo добавить отображение наличия и качества обратной связи

	}

	getDetailValueByName(name) { 	// Returns a detail value by its name[name:str]

		for (let i = 0; i < this.details_length; i++) {

			if (this.details[i].name === name) {

				return this.details[i].value

			}
		}

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

}

class Analysis {	// Analysis class

	constructor(
		options_default,
	) {
		this.options_default = options_default;
	}

	//todo не отрабатывает post_info для comment type

	initOptionsDefaults() {	//Init object of default options [this.options_default] from specified JSON of options. JSON source sets up manually form current versions of ClenTalk plugins

		this.options_default = {
			wordpress: '',
			drupal: '',
			joomla: '',
		}

		//JSON handling
		this.options_default.wordpress = helper.getOptionsFromJSON('{"spam_firewall":"1","sfw__anti_flood":"1","sfw__anti_flood__view_limit":"20","sfw__anti_crawler":"1","sfw__anti_crawler_ua":"1","apikey":"9arymagatetu","autoPubRevelantMess":"0","registrations_test":"1","comments_test":"1","contact_forms_test":"1","general_contact_forms_test":"1","wc_checkout_test":"1","wc_register_from_order":"1","search_test":"1","check_external":"0","check_external__capture_buffer":"0","check_internal":"0","disable_comments__all":"0","disable_comments__posts":"0","disable_comments__pages":"0","disable_comments__media":"0","bp_private_messages":"1","check_comments_number":"1","remove_old_spam":"0","remove_comments_links":"0","show_check_links":"1","manage_comments_on_public_page":"0","protect_logged_in":"1","use_ajax":"1","use_static_js_key":"-1","general_postdata_test":"0","set_cookies":"1","set_cookies__sessions":"0","ssl_on":"0","use_buitin_http_api":"1","exclusions__urls":"","exclusions__urls__use_regexp":"0","exclusions__fields":"","exclusions__fields__use_regexp":"0","exclusions__roles":["Administrator"],"show_adminbar":"1","all_time_counter":"0","daily_counter":"0","sfw_counter":"0","user_token":"","collect_details":"0","send_connection_reports":"0","async_js":"0","debug_ajax":"0","gdpr_enabled":"0","gdpr_text":"","store_urls":"1","store_urls__sessions":"1","comment_notify":"1","comment_notify__roles":[],"complete_deactivation":"0","dashboard_widget__show":"1","allow_custom_key":"0","allow_custom_settings":"0","white_label":"0","white_label__hoster_key":"","white_label__plugin_name":"","use_settings_template":"0","use_settings_template_apply_for_new":"0","use_settings_template_apply_for_current":"0","use_settings_template_apply_for_current_list_sites":""}');

	}

	compareCtOptionsWithDefaults(def_options_agent) {	//Compares request options with defaults by agent [def_options_agent:str]

		let changes_array = [];

		// Collects options changed
		for (let i = 0; i <= def_options_agent.length - 1; i++) {

			const def_value = helper.trimAndLow(def_options_agent[i].value);

			for (let j = 0; j<= ct.options.length -1; j++) {

				const req_value = helper.trimAndLow(ct.options[j].value);

				if ( (def_options_agent[i].name === ct.options[j].name) && ( def_value !== req_value )) {

					changes_array.push(j);
					helper.addToChangedOptionsList(ct.options[j].name);

				}
			}
		}

		// Colors changed options
		changes_array.forEach(function (value) {
			let tr_name = ('options_tier_' + value);
			layout_window.document.getElementById(tr_name).style.color = '#FF0000';

		})

		helper.addToChangedOptionsList('<p><b>Опций изменено:'+changes_array.length+'</b></p>');

	}

	checkOptions() {	// Calls options checking compareCtOptionsWithDefaults if the agent is supported

		//todo Дублирование опций обойти https://cleantalk.org/noc/requests?request_id=460ecc492b54f98b5b5bbf26a3629848

		if (ct.status.agent.includes('wordpress')) {

			this.compareCtOptionsWithDefaults(this.options_default.wordpress);

		} else {

			layout_window.document.getElementById('options_header').innerHTML += ' Options checking is not supported for this plugin yet';

		}
		// The place for other agents if released
	}

	checkDetails() {	//Checks details, main analysis logic implementation

		for (let i=0; i<=ct.details.length-1; i++){

			let detail = ct.details[i];

			switch (detail.name) {

				//SHORTCACHES
				case 'sender_email_is_sc': {

					if (Number(detail.value) >= 30) {

						detail.css_id = 'BAD';
						helper.addToIssuesList('EMAIL в шорткэше', '0');

					} else detail.value = 'INVISIBLE';

				} break;

				case 'sender_ip_is_sc': {

					if (Number(detail.value) >= 30) {

						detail.css_id = 'BAD';
						helper.addToIssuesList('IP в шорткэше', '0');

					} else detail.value = 'INVISIBLE';

				} break;

				//EMAIL
				case 'sender_email': {

					if (detail.value === '') {

						detail.css_id = 'BAD';
						helper.addToIssuesList('EMAIL передан, но пустой', '3');

					} else if (detail.value === null) {

						detail.css_id = 'INCORRECT';
						helper.addToIssuesList('Не смогли определить EMAIL', '10');

					} else if (ct.getDetailValueByName('sender_email_is_bl')==2){

						detail.css_id = 'BAD';

					} else detail.css_id = 'GOOD';


				} break;

				//JS
				case 'js_status': {

					if (Number(detail.value) === -1){
						detail.css_id= 'BAD';
						helper.addToIssuesList('JS отключен в браузере', '3');
					}

					else if (Number(detail.value) === 1){
						detail.css_id= 'GOOD';
					}

					else if(Number(detail.value) === 0){
						detail.css_id= 'BAD'
						helper.addToIssuesList('Тест JS провален', '3');
					}

					else {
						detail.css_id= 'INCORRECT';
						helper.addToIssuesList('Не смогли определить JS', '10');
					}
				} break;

				//IP
				case 'sender_ip': {

					if (detail.value === '') {

						detail.css_id= 'BAD';
						helper.addToIssuesList('IP адрес пустой', '3');

					} else if (detail.value === null) {

						detail.css_id= 'INCORRECT';
						helper.addToIssuesList('Не смогли определить IP адрес', '10');

					} else if (ct.getDetailValueByName('sender_ip_is_bl')==2){

						detail.css_id = 'BAD';

					}
					else detail.css_id= 'GOOD';

				}break;

				//REFERRER
				case 'page_referrer': {

					if (detail.value === '') {

						detail.css_id= 'BAD';
						helper.addToIssuesList('REFERRER  пустой', '3');

					} else if (detail.value.includes('google')) {

						detail.css_id= 'BAD';
						helper.addToIssuesList('Поисковик в REFERRER', '10');

					}  else detail.css_id= 'GOOD';

				}break;

				//PRE-REFERRER
				case 'page_pre_referrer': {

					if (detail.value === '') {

						detail.css_id= 'BAD';
						helper.addToIssuesList('PRE-REFERRER  пустой', '3');

					} else if (detail.value.includes('google')) {

						detail.css_id= 'BAD';
						helper.addToIssuesList('Поисковик в PRE-REFERRER', '10');

					}  else detail.css_id= 'GOOD';

				}break;

				//SUBMIT_TIME
				case 'submit_time': {

					if ( detail.value === undefined || detail.value === '' ){
						detail.css_id= 'INCORRECT';
						helper.addToIssuesList('Не смогли определить SUBMIT_TIME.', '10');
					}

					else if (Number(detail.value) === 0){
						detail.css_id= 'BAD';
						helper.addToIssuesList('SUBMIT_TIME = 0. Возможен GREYLISTING', '5');
					}

					else if(Number(detail.value) === 1){
						detail.css_id= 'INCORRECT'
						helper.addToIssuesList('SUBMIT_TIME = 1, так быть не должно. Делай тест.', '10');
					}

					else if(1 <= Number(detail.value) && Number(detail.value <= 5) ){
						detail.css_id= 'BAD'
						helper.addToIssuesList('1 <= SUBMIT_TIME < 5, слишком низкий.', '3');
					}

					else if(500 <= Number(detail.value) && Number(detail.value) <= 3000){
						detail.css_id= 'BAD'
						helper.addToIssuesList('3000 > SUBMIT_TIME > 500, многовато.', '3');
					}

					else if(Number(detail.value) > 3000){
						detail.css_id= 'BAD'
						helper.addToIssuesList('SUBMIT_TIME > 3000, есть проблемы.', '3');
					}

					else {
						detail.css_id= 'GOOD';
					}

				} break;

				//COOKIES
				case 'cookies_enabled': {

					if (detail.value === '' ||
						detail.value === null) {

						detail.css_id= 'BAD';
						helper.addToIssuesList('Не смогли определить наличие COOKIES', '3');

					} else if (detail.value == 0){

						detail.css_id = 'BAD';
						helper.addToIssuesList('COOKIES отключены', '10');

					}
					else detail.css_id= 'GOOD';

				}break;

				//GREYLIST
				case 'is_greylisted': {

					if (detail.value == 1) {

						detail.css_id= 'BAD';
						helper.addToIssuesList('Сработал GREYLIST. Смотри SUBMIT_TIME.', '3');

					}
					else detail.value= 'INVISIBLE';

				}break;

				//MOBILE_UA
				case 'is_mobile_ua': {

					if (detail.value == 1) {

						detail.css_id= 'GOOD';
						helper.addToIssuesList('USERAGENT - мобильное устройство', '0');

					}
					else detail.value= 'INVISIBLE';

				}break;

				//PAGE_URL and SENDER_URL
				case 'sender_url':
				case 'page_url': {

					if (detail.value.includes('members') ||
						detail.value.includes('admin') ||
						detail.value.includes('login')
					) {

						detail.css_id= 'BAD';
						helper.addToIssuesList('Возможен перехват админки, смотри PAGE_URL и SENDER_URL', '0');

					} else if(detail.value === '' || detail.value === null) {

						detail.css_id= 'BAD';
						helper.addToIssuesList('Пустой PAGE_URL или SENDER_URL. Это странно, но не более.', '0');

					}

					else detail.css_id= 'GOOD';

				}break;
			}
		}
	}

}

//==== DECLARE BLOCK
const CURRENT_VERSIONS = new Map(
	[
		['wordpress','wordpress-51514']
	]
)
let EXTRACTED_HTML;

let ct = new CT();
ct.analysis = new Analysis();
ct.status = new Status();

helper = new Helper();
helper.initHelperData();

//==== DECLARE BLOCK END

//==== LISTENERS
chrome.runtime.onMessage.addListener(function (message) {
	switch (message.command) {

		case "pageHtml":
			EXTRACTED_HTML = message.html;
			helper.callWindow();
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
