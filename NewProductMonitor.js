const fetch = require('node-fetch');
const Discord = require('discord.js')
const { getRandom, getPollInterval, sleep, doesContain } = require('./utils/tools.js');
const userAgents = require('./utils/useragents.js');
const moment = require('moment');

const body = {
  operationName: "products",
  query: "query products {\n  products(\n    attribute_code: []\n    category_id: 327\n    current_page: 1\n    page_size: 100\n    applied_filters: \"&searchCriteria[filter_groups][21][filters][0][field]=pan_show_product_in_app_only&searchCriteria[filter_groups][21][filters][0][value]=1&searchCriteria[filter_groups][21][filters][0][condition_type]=neq&searchCriteria[sortOrders][0][field]=position&searchCriteria[sortOrders][0][direction]=ASC\"\n    is_store: true\n    isPaniniAuction: false\n    customise_banner: 327\n  ) {\n    items {\n      id\n      name\n      price\n      sku\n      status\n      image\n      special_price\n      reward_points\n      pan_release_date\n      special_from_date\n      special_to_date\n      pan_offer_start_date\n      pan_offer_end_date\n      url_key\n      final_price\n      is_in_stock\n      min_sale_qty\n      max_sale_qty\n      type_id\n      thumbnail\n      isStore\n      pan_coming_soon\n      pan_store_auction_start_price\n      pan_store_auction_end_price\n      pan_store_auction_price_drop\n      isAuction\n      isCrypto\n      category_ids\n      buy_now_price\n      highest_bid\n      is_bid\n      is_top_bidder\n      is_owner\n      is_placed_bid\n      total_bids\n      auction_id\n      fullname\n      pan_show_timer\n      created_time\n      purchased_price\n      auction_won_time\n      current_time\n      is_admin_created_auction\n      last_bid_time\n      bid_reset_interval\n      is_validating\n      physical_gift_description\n      pan_physical_gift\n      pan_gift_image_1\n      pan_gift_image_2\n      pan_gift_image_3\n      is_promo_product\n      pan_hide_price\n      web_color\n      web_product_icon\n      type_type\n      is_user_liked\n      is_public_visible\n      allow_offers\n      visibility_type\n      likes_count\n      in_public_auction\n      amount\n      __typename\n    }\n    search_criteria {\n      page_size\n      current_page\n      total_count\n      __typename\n    }\n    image\n    meta_title\n    meta_keywords\n    meta_description\n    short_description\n    timestamp\n    panini_fee_msg\n    description\n    cards_count\n    collection_image_url\n    collection_selected\n    collection\n    yet_to_be_moved\n    public_auctions_card_count\n    in_gallery\n    data {\n      data {\n        type_type\n        type_name\n        url_key\n        web_title_icon\n        web_color\n        web_product_icon\n        count\n        category_id\n        timestamp\n        items {\n          id\n          name\n          price\n          sku\n          status\n          image\n          special_price\n          reward_points\n          pan_release_date\n          special_from_date\n          special_to_date\n          pan_offer_start_date\n          pan_offer_end_date\n          url_key\n          final_price\n          is_in_stock\n          min_sale_qty\n          max_sale_qty\n          type_id\n          thumbnail\n          isStore\n          pan_coming_soon\n          pan_store_auction_start_price\n          pan_store_auction_end_price\n          pan_store_auction_price_drop\n          isAuction\n          isCrypto\n          category_ids\n          buy_now_price\n          highest_bid\n          is_bid\n          is_top_bidder\n          is_owner\n          is_placed_bid\n          total_bids\n          auction_id\n          fullname\n          pan_show_timer\n          created_time\n          purchased_price\n          auction_won_time\n          current_time\n          is_admin_created_auction\n          last_bid_time\n          bid_reset_interval\n          is_validating\n          physical_gift_description\n          pan_physical_gift\n          pan_gift_image_1\n          pan_gift_image_2\n          pan_gift_image_3\n          is_promo_product\n          pan_hide_price\n          web_color\n          web_product_icon\n          type_type\n          is_user_liked\n          is_public_visible\n          allow_offers\n          visibility_type\n          likes_count\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}",
  variables: {}
}

class NewProductMonitor {

  constructor(webhooks) {
    this.url = 'https://api.paniniamerica.net/onepanini';
    this.products = [];
    this.stop = false;
    this.webhooks = webhooks;
  }

  //Start monitor
  async start() {
    console.log("Panini Module Starting")
    if(this.stop) return;
    let init = this.init();
    init.then(() => {
      return this.monitor();
    });
  }

  //Initializes products
  async init() {
    console.log('Initializing Current Stock')
    return fetch("https://api.paniniamerica.net/onepanini", {
      "headers": {
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br",  
        "accept-language": "en-US,en;q=0.9",
        "authorization": "",
        "cart_id": "",
        "connection": "keep-alive",
        "content-length": "4188",
        "content-type": "application/json",
        "host": "api.paniniamerica.net",
        "origin": "https://www.paniniamerica.net",
        "os": "web",
        "referrer": "https://www.paniniamerica.net/cards.html",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "signature": "5e78ca57229f976f826fc99d5dac42a8",
        "user-agent": getRandom(userAgents),
        "uuid": "587adf593fa38eceb3c2d5f799f68440",
        "v-id": "3.3.1",
        "x-amz-cart-id": "",
        "x-amz-os": "web",
        "x-amz-s-id": "",
        "x-amz-u-id": ""
    },
      "referrer": "https://www.paniniamerica.net/cards.html",
      "referrerPolicy": "no-referrer-when-downgrade",
      "body": JSON.stringify(body),
      "method": "POST",
      "mode": "cors"
    })
    .then(res => res.json())
    .then(json => {
      if(json.data) {
        let data = json.data.products.items;
        data.forEach((value, index) => {
          console.log(`${index+1}: ${value.name}, $${value.price}`)
        })
        this.products = data;
        console.log("Stock Initialized")
      } else {
        console.log("Product Init Error")
      }
    });
  }

  async getData() {
    return fetch("https://api.paniniamerica.net/onepanini", {
      "headers": {
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br",  
        "accept-language": "en-US,en;q=0.9",
        "authorization": "",
        "cart_id": "",
        "connection": "keep-alive",
        "content-length": "4188",
        "content-type": "application/json",
        "host": "api.paniniamerica.net",
        "origin": "https://www.paniniamerica.net",
        "os": "web",
        "referrer": "https://www.paniniamerica.net/cards.html",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "signature": "5e78ca57229f976f826fc99d5dac42a8",
        "user-agent": getRandom(userAgents),
        "uuid": "587adf593fa38eceb3c2d5f799f68440",
        "v-id": "3.3.1",
        "x-amz-cart-id": "",
        "x-amz-os": "web",
        "x-amz-s-id": "",
        "x-amz-u-id": ""
      },
      "referrer": "https://www.paniniamerica.net/cards.html",
      "referrerPolicy": "no-referrer-when-downgrade",
      "body": JSON.stringify(test_body),
      "method": "POST",
      "mode": "cors"
    })
    .then(res => res.json())
    .then(json => {
      if(json.data) {
        return json.data.products.items;
      } else {
        return;
      }
    });
  }

  async monitor() {
    let data = await this.getData();
    console.log(`Monitoring Endpoint`)
    //null check on data from endoint
    if(data) {

      // Old monitoring technique
      // if(JSON.stringify(data) !== JSON.stringify(this.products)) {
      //   let productJSON = JSON.stringify(this.products);
      //   data.forEach((value, index) => {
      //     if(!productJSON.includes(JSON.stringify(value))) {
      //       console.log(`${index+1}: NEW ITEM FOUND: ${value.name}`);
      //       let embed = this.createEmbed(value);
      //       //invoke sendDiscordNotification here within a forEach iterating through //servers
            
      //     }
      //   })
      //   this.products = data;
      // }

      if(JSON.stringify(data) !== JSON.stringify(this.products)) {
        data.forEach((value, index) => {
          if(!doesContain(this.products, value)) {
            console.log(`${index+1}: NEW ITEM FOUND: ${value.name}`);
            let embed = this.createEmbed(value);
            this.sendDiscordNotification(embed)
          }
        })
        this.products = data;
      }
    }
    console.log("Sleeping.....")
    await sleep(getPollInterval(5000, 15000));
    this.monitor();
  }

  createEmbed(value) {
    return new Discord.MessageEmbed()
      .setTitle(value.name)
      .setURL(`https://www.paniniamerica.net/${value.url_key}`)
      .setThumbnail(`https://prod-paninicx-store.s3.amazonaws.com/catalog/product${value.image}`)
      .addFields(
        {name: "Max Qty", value: value.max_sale_qty},
        {name: "Price", value: `$${value.price}`},
        {name: "Coming Soon", value: Boolean(parseInt(value.pan_coming_soon))},
        {name: "Add to Cart", value: "TODO"},
        {name: "Useful Links", 
          value: `[Product Link](https://www.paniniamerica.net/${value.url_key}) | [Cart](https://www.paniniamerica.net/cart.html) | [Checkout](https://www.paniniamerica.net/cart.html?s=2)`}
      )
      .setTimestamp()
      .setFooter(`Panini Monitor By @AdroitMonitors ${moment().format('h:mm:ss a')}`, 'https://cdn.discordapp.com/attachments/536440375368220690/791551894472097809/Profile_Pic.png')
  }

  sendDiscordNotification(embed) {
    this.webhooks.forEach((value) => {
      let webhook = new Discord.WebhookClient(value.id, value.token);
      webhook.send(embed);
    })
  }

}

module.exports = NewProductMonitor;