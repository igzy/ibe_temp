import { BehaviorSubject } from "../../../../node_modules/rxjs";

export class AuthorizationService {
    isAuthorized = new BehaviorSubject<boolean>(true);
    authorized = this.isAuthorized.asObservable();

    setAuthorizationStatus(isAuthorized: boolean) {
        this.isAuthorized.next(isAuthorized);
    }
}