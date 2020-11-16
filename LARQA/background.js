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

      //поиск одобрен/нет

      this.isAllowed = ct.call_detail_value_by_name('is_allowed');

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

    let ar = [];

    for (let j = 0; j < detail_array_length; j++) {
      ar.push(parseInt(this.details[j].block_id));
    }

    let number_of_blocks = Math.max.apply(null, ar) + 1; //колчество блоков определено

    for (let block_id = 0; block_id !== number_of_blocks; block_id++) {

      html_add_tag_to_window('details_table-tbody', 'beforeend', ('<tr id="details_tier_block_' + block_id + '">SECTION ' + block_id + '</tr>'));

      for (let i = 0; i < detail_array_length - 1; i++) { //добавление строк

        if (stringcounter <= i) { //хуй знает как это работает и почему без этого не работает

          if (parseInt(this.details[stringcounter].block_id) === block_id) { // добавляем строки если block_id совпал
            stringcounter++;

            if (this.details[stringcounter].name !== 'ct_options') {

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

  } 			//создаёт объекты Details в массиве (без values)

  init_options_array() { 				//создаёт объекты Option в массиве ct.options

    console.log('Началась инициация массива Options');

    this.options = get_options_from_json(this.call_detail_value_by_name("ct_options"));

    console.log('Закончена инициация массива Options');

  }			//создаёт объекты Option в массиве ct.options

  call_detail_value_by_name(name) { 	//вызывает значения value объекта Detail по имени

    for (let i = 0; i < detail_array_length; i++) {

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

    //Init class
    this.name = name;
    this.value = value;
    this.priority = priority;

  }

}

class Analysis{

  constructor(

      options_default,
      options_important,
      details_normal_values

  ) {

    this.options_default = options_default;
    this.details_normal_values = details_normal_values;
  }
//todo Проверить почем уне совпало количество опицй https://cleantalk.org/noc/requests?request_id=4d6d82ee9e7d3e7da409520725a9b6d4
  //todo не отрабатывает post_info для comment type
  //todo сделать "все запросы с этим IP "
  set_options_default() { 			//устанавлвает опций по умолчанию

    this.options_default = { // объект опций
      wordpress: '',
      drupal: '',
      joomla: '',

    }

    //берёт массив опций из JSON

    this.options_default.wordpress = get_options_from_json('{"spam_firewall":"1","sfw__anti_flood":"0","sfw__anti_flood__view_limit":"10","sfw__anti_crawler":"0","apikey":"pyme7anenuha","autoPubRevelantMess":"0","registrations_test":"1","comments_test":"1","contact_forms_test":"1","general_contact_forms_test":"1","wc_checkout_test":"1","wc_register_from_order":"1","search_test":"1","check_external":"0","check_external__capture_buffer":"0","check_internal":"0","disable_comments__all":"0","disable_comments__posts":"0","disable_comments__pages":"0","disable_comments__media":"0","bp_private_messages":"1","check_comments_number":"1","remove_old_spam":"0","remove_comments_links":"0","show_check_links":"1","manage_comments_on_public_page":"0","protect_logged_in":"1","use_ajax":"1","use_static_js_key":"-1","general_postdata_test":"0","set_cookies":"1","set_cookies__sessions":"0","ssl_on":"0","use_buitin_http_api":"1","exclusions__urls":"","exclusions__urls__use_regexp":"0","exclusions__fields":"","exclusions__fields__use_regexp":"0","exclusions__roles":["Administrator"],"show_adminbar":"1","all_time_counter":"0","daily_counter":"0","sfw_counter":"0","user_token":"","collect_details":"0","send_connection_reports":"0","async_js":"0","debug_ajax":"0","gdpr_enabled":"0","gdpr_text":"","store_urls":"1","store_urls__sessions":"1","comment_notify":"1","comment_notify__roles":[],"complete_deactivation":"0","dashboard_widget__show":"1","allow_custom_key":"0","allow_custom_settings":"0","white_label":"0","white_label__hoster_key":"","white_label__plugin_name":"","use_settings_template":"0","use_settings_template_apply_for_new":"0","use_settings_template_apply_for_current":"0","use_settings_template_apply_for_current_list_sites":""}');

  }

  set_details_normal_values(){

  }

  check_options_comparison(def_options_agent){

    let array = [];

    if (def_options_agent.length === ct.options.length ){

      for (let i=0; i<=def_options_agent.length - 1; i++){

        let x = def_options_agent[i].value.toString()

        let y = ct.options[i].value.toString();

        if (x !== y){

          console.log('Изменены опции: '
              + def_options_agent[i].name + ' :'
              + x + ' '
              + y);

          array.push(i);

        }

      }

    }	else alert('Количество опций не совпало. Проверь агента. def_options_agent.length = ' + def_options_agent.length + 'ct.options.length = '+ ct.options.length);

    array.forEach(function(value){

      let tr_name = ('options_tier_'+value);

      layout_window.document.getElementById(tr_name).style.color = '#FF0000';

    })

    layout_window.document.getElementById('options_header').innerHTML += ('<a style = "color: red"> (' + array.length + ')</a>');

    return array;

  }

  check_options(){

    console.log('Проверка опций по умолчанию началась...');

    switch (ct.status.agent){		// Выбор параметров по умолчанию по агенту

      case 'wordpress-51471': {

        this.check_options_comparison(this.options_default.wordpress);

      }

      case 'wordpress-5148': {

        this.check_options_comparison(this.options_default.wordpress);

      }

    }

    console.log('Проверка опций по умолчанию завершена.');


  }

  check_details(){

  }


}


//==== TEST BLOCK

//==== TEST BLOCK END

//==== DECLARE BLOCK

let extracted_html;

let ct = new CT();

ct.id = new Id();

ct.status = new Status();

ct.analysis = new Analysis();

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
  //console.log('TAG COUNSTRUCTS... POS ' + position_tag_id + ' ALGN ' + align + ' HTML ' + html);
  layout_window.document.getElementById(position_tag_id).insertAdjacentHTML(align, html);

} //добавляет тег

function get_options_from_json (json){ //возвращает массив объектов OPTION из JSON настроек

  let jsonobj = JSON.parse(json);

  let temp = [];

  $.each(jsonobj, function (name, value) {

    temp.push(new Option(name, value, 0))

  })

  return temp;

} //извлекает массив опций из JSON

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

    ct.status.init();

    ct.analysis.set_options_default();

    window.stringcounter = 0; //счётчик строк в таблице

    ct.construct_details_block_html(); //собираю таблицу details

    ct.construct_options_block_html(); // собираю таблицу options

    ct.analysis.check_options();

  }//вызов окна запроса

} //вызов рабочего окна

chrome.runtime.onMessage.addListener(function (message) {
  switch (message.command) {
    case "pageHtml":

      console.log('Бэкграунд начал работу..');

      console.log(message.html)

      extracted_html = message.html;

      call_layout_window();

      console.log('Бэкграунд закончил работу.');


      break;
  
    default:
      break;
  }
})

function logHtmlCode(tab)
{
  chrome.tabs.executeScript(tab.id, { file: "send-page-code.js" });
}

chrome.browserAction.onClicked.addListener(logHtmlCode);
