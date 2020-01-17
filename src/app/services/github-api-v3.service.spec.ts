import { environment } from './../../environments/environment.prod';
import { GithubApiV3Service } from './github-api-v3.service';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


const testUrl = `${environment.urlApiV3}/users`;

describe('HttpClient testing', () => {
  let httpClient: HttpClient;
  let githubService: GithubApiV3Service;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });

    httpClient = TestBed.get(HttpClient);
    githubService = TestBed.get(GithubApiV3Service);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('can test get User', () => {
    const testData = 'concretesolutions';

    githubService.getUser("concretesolutions")
      .subscribe((data: any) =>
        expect(data).toEqual(testData)
      );

    const req = httpTestingController.expectOne(`${testUrl}/concretesolutions`);

    expect(req.request.method).toEqual('GET');

    req.flush(testData);

    httpTestingController.verify();
  });

  it('can test multiple requests', () => {
    const testData = 'concretesolutions';

    githubService.getData("concretesolutions")
      .subscribe(response => expect(response.length).toEqual(2, 'should be one element array'));

    const req = httpTestingController.expectOne(`${testUrl}/concretesolutions`);
    expect(req.request.method).toEqual('GET');
    const req2 = httpTestingController.expectOne(`${testUrl}/concretesolutions/repos`);
    expect(req2.request.method).toEqual('GET');

    req.flush(testData);
    req2.flush(testData);

    httpTestingController.verify();
  });

  it('can test for 404 error', () => {
    const emsg = 'deliberate 404 error';

    githubService.getUser('anything').subscribe(
      data => fail('should have failed with the 404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404, 'status');
        expect(error.error).toEqual(emsg, 'message');
      }
    );

    const req = httpTestingController.expectOne(`${testUrl}/anything`);

    req.flush(emsg, { status: 404, statusText: 'Not Found' });
  });

  it('can test for network error', () => {
    const emsg = 'simulated network error';

    githubService.getUser("concretesolutions").subscribe(
      data => fail('should have failed with the network error'),
      (error: HttpErrorResponse) => {
        expect(error.error.message).toEqual(emsg, 'message');
      }
    );

    const req = httpTestingController.expectOne(`${testUrl}/concretesolutions`);

    const mockError = new ErrorEvent('Network error', {
      message: emsg,
      lineno: 42,
      colno: 21
    });

    req.error(mockError);
  });

});
