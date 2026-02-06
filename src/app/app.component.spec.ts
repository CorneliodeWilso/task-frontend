import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { UtilsService } from './core/services/utils.service';
import { BehaviorSubject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let utilsService: UtilsService;

  const loadingSubject = new BehaviorSubject<boolean>(false);

  beforeEach(async () => {
    const utilsServiceMock = {
      loading$: loadingSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: UtilsService, useValue: utilsServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    utilsService = TestBed.inject(UtilsService);

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('have title "task-frontend"', () => {
    expect(component['title']).toBe('task-frontend');
  });

  it('expose UtilsService public', () => {
    expect(component.utils).toBeDefined();
    expect(component.utils).toBe(utilsService);
  });

  it('react to loading observable as true', () => {
    loadingSubject.next(true);
    fixture.detectChanges();

    expect(component.utils).toBeTruthy();
  });

  it('react to loading observable as false', () => {
    loadingSubject.next(false);
    fixture.detectChanges();

    expect(component.utils).toBeTruthy();
  });
});

