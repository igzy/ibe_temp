import { Injectable } from '@angular/core';
import { HistorySearchListModel, HistorySearchModel } from '../../shared/models/history-search-model';
import {SEARCH_LIST_COOKIE, COOKIE_EXP_DAYS, SEARCH_LIST_COOKIE_COUNT } from '../../configs/app-settings.config';
@Injectable()
export class CookieService {

  searchListCookie = SEARCH_LIST_COOKIE;
  constructor() {}

  public deleteCookie(name) {
    this.setCookie(name, '', -1 );
  }

  public getCookie(name: string): any {
    const ca: Array<string> = document.cookie.split(';');
    const caLen: number = ca.length;
    const cookieName = `${name}=`;
    let c: string;

    for (let i = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) === 0) {
        return c.substring(cookieName.length, c.length);
      }
    }

    return null;
  }

  public setCookie(name: string, value: any, expireDays: number = COOKIE_EXP_DAYS) {
    const d: Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    const expires: string = 'expires=' + d.toUTCString();
    document.cookie = name + '=' + value + '; ' + expires;
  }

  public setSearchHistoryCookie(name: string, value: HistorySearchModel, expireDays: number = COOKIE_EXP_DAYS) {
    
    let existingSearchListCookie: HistorySearchListModel;//JSON.parse(this.getCookie(this.searchListCookie));
    try {
      existingSearchListCookie = JSON.parse(this.getCookie(this.searchListCookie));
    } catch {
      console.log("Issue detected for the existing searchListCookie. Deleting corrupted searchListCookie..");
      existingSearchListCookie = null;
    }

    let newSearchListCookie: HistorySearchListModel = [];
    newSearchListCookie.push(value);

    if (!(existingSearchListCookie === null || existingSearchListCookie === undefined)) {
      newSearchListCookie = existingSearchListCookie.slice();
      if (existingSearchListCookie.length >= SEARCH_LIST_COOKIE_COUNT ) {
        newSearchListCookie.shift();
      }
      newSearchListCookie.push(value);

      this.deleteCookie(this.searchListCookie);
    } 
    /* replacer will omit the alias key as it has the potential to break the stringify 
    function due to ampersand(&) on the values.*/
    let replacer = function (key, value) {
      if(key === 'alias') {
          return undefined;
      }
      return value;
    };
    this.setCookie(this.searchListCookie, JSON.stringify(newSearchListCookie, replacer));

    /* additional step to check if there's nothing wrong with the saved cookie. 
    if there's a problem with it, it will be reverted to the last existingSearchListCookie retrieved from the cookies. */
    try {
      JSON.parse(this.getCookie(this.searchListCookie));
    } catch {
      console.log("Issue detected for the new searchListCookie. Reverting the searchList Cookie to the last working version..");
      this.setCookie(this.searchListCookie, JSON.stringify(existingSearchListCookie));
    }
  }
}
