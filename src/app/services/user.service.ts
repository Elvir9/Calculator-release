import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class UsersService {

    private usersAnswers = [];
    private subject = new Subject<any>();

    constructor(private http: HttpClient) {}

    getUsersAnswers(answer: any, time: number, price: number, name: string, email: string , koeficijent:number) {
        const userAnswer = {
            answer: answer,
            estimatedTime:  Math.floor(koeficijent * time),
            estimatedPrice: Math.floor(koeficijent * price),
            usersName: name,
            usersEmail: email,
        }
        this.http.post<{message: string}>('api/user', userAnswer)
            .subscribe((responseData) => {
                console.log('Message: ' + responseData.message);
                this.usersAnswers.push(userAnswer);
                console.log(this.usersAnswers);
                this.subject.next({
                    usersAnswers: this.usersAnswers
            });
        });

        this.http.post("sendmail", userAnswer).subscribe(
            data => {
                let res:any = data;
                console.log(
                    `👏 > 👏 > 👏 > 👏 ${userAnswer.usersName} is successfully register and mail has been sent`
                );
            },
                err => {
            console.log(err);
        },() => {
                console.log('Complete');
        }
        );
    }

    getAnswersUpdated(): Observable<any> {
        return this.subject.asObservable();
    }

}
