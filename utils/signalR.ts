//thiết lập 1 singleton class để quản lý kết nối tới SignalR

import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

export default class SignalR {
  //singleton pattern
  private static _instance: SignalR; //chứa instance của class SignalR
  private _hubConnection: HubConnection; //chứa instance của class HubConnection

  private constructor() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL_PROD}/chatHub`)
      .withAutomaticReconnect()
      .build();
  }

  //tạo ra 1 static method để gọi đến instance của class SignalR
  public static get Instance(): SignalR {
    return this._instance || (this._instance = new this()); //sẽ tạo ra 1 instance mới nếu chưa có, nếu có rồi thì trả về instance đó
  }

  //lấy ra instance của class HubConnection
  public get HubConnection(): HubConnection {
    return this._hubConnection;
  }
}
