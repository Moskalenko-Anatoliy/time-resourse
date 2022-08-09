class UserList {
  constructor() {
    this.list = [
      { userId: 3, login: "tolik", host: "172.16.176.199:3307", db: "mav_time_main1", hash: "$2a$10$kgnJSuNL4NJGmRIuV.fG7.zTw5T/H4xXo8VJ5ZHVcvdMhhJBmuAQ2", refreshToken: "" },
      { userId: 2, login: "bks", host: "172.16.176.199:3307", db: "mav_time_main1", hash: "$2a$10$kgnJSuNL4NJGmRIuV.fG7.zTw5T/H4xXo8VJ5ZHVcvdMhhJBmuAQ2", refreshToken: "" },
      { userId: 5, login: "pijon", host: "172.16.176.199:3307", db: "mav_time_main1", hash: "$2a$10$kgnJSuNL4NJGmRIuV.fG7.zTw5T/H4xXo8VJ5ZHVcvdMhhJBmuAQ2", refreshToken: "" },
      { userId: 9, login: "olga", host: "172.16.176.199:3307", db: "mav_time_main1", hash: "$2a$10$kgnJSuNL4NJGmRIuV.fG7.zTw5T/H4xXo8VJ5ZHVcvdMhhJBmuAQ2", refreshToken: "" },                  
    ]
  }

  findUserId() {
    return ( this.list.findIndex(elem => elem.userId === userId && elem.host === host) );
  }

  updateHash(userId, host, db, hash) {
    const index = this.list.findIndex(elem => elem.userId === userId && elem.host === host);
    if (index) {
      this.list[index].hash = hash
    }
  }


}

module.exports = UserList;
