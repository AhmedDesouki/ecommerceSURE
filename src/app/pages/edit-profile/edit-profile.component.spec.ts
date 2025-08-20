import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { EditProfileComponent } from './edit-profile.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getProfile', 'updateProfile', 'changePassword']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'updateUserProfile']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EditProfileComponent, ReactiveFormsModule],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    mockApiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current user data', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user'
    };
    mockAuthService.getCurrentUser.and.returnValue(mockUser);

    component.ngOnInit();

    expect(component.currentUser).toEqual(mockUser);
  });

  it('should navigate to login if no user is authenticated', () => {
    mockAuthService.getCurrentUser.and.returnValue(null);

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should load profile data on init', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user'
    };
    const mockProfileData = {
      fullName: 'Test User',
      email: 'test@example.com'
    };
    
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockApiService.getProfile.and.returnValue(of(mockProfileData));

    component.ngOnInit();

    expect(mockApiService.getProfile).toHaveBeenCalled();
    expect(component.profileForm.value.fullName).toBe('Test User');
    expect(component.profileForm.value.email).toBe('test@example.com');
  });

  it('should handle profile update successfully', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user'
    };
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockApiService.getProfile.and.returnValue(of({}));
    mockApiService.updateProfile.and.returnValue(of({ success: true }));

    component.ngOnInit();
    component.profileForm.patchValue({
      fullName: 'Updated User',
      email: 'updated@example.com'
    });

    component.onSubmitProfile();

    expect(mockApiService.updateProfile).toHaveBeenCalledWith({
      fullName: 'Updated User',
      email: 'updated@example.com'
    });
    expect(component.profileMessage).toContain('successfully');
  });

  it('should handle password change successfully', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user'
    };
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockApiService.getProfile.and.returnValue(of({}));
    mockApiService.changePassword.and.returnValue(of({ success: true }));

    component.ngOnInit();
    component.showPasswordForm = true;
    component.passwordForm.patchValue({
      currentPassword: 'oldpass',
      newPassword: 'newpass',
      confirmPassword: 'newpass'
    });

    component.onSubmitPassword();

    expect(mockApiService.changePassword).toHaveBeenCalledWith({
      currentPassword: 'oldpass',
      newPassword: 'newpass'
    });
    expect(component.passwordMessage).toContain('successfully');
  });

  it('should validate password match', () => {
    component.passwordForm.patchValue({
      currentPassword: 'oldpass',
      newPassword: 'newpass',
      confirmPassword: 'different'
    });

    expect(component.passwordForm.errors?.['passwordMismatch']).toBeTruthy();
  });

  it('should toggle password form visibility', () => {
    expect(component.showPasswordForm).toBeFalse();

    component.togglePasswordForm();
    expect(component.showPasswordForm).toBeTrue();

    component.togglePasswordForm();
    expect(component.showPasswordForm).toBeFalse();
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
