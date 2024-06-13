import {
  tryToLogIn,
  tryToLogOut,
  userFeature,
} from '@item-catalogue/auth-state';
import { RxIf } from '@rx-angular/template/if';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TopNavComponent } from '@item-catalogue/home-ui';
import { Component, inject } from '@angular/core';
import { rxState } from '@rx-angular/state';
import { Subject, map } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '@item-catalogue/shared-service';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { stateful } from '@rx-angular/state/selections';

@Component({
  selector: 'item-catalogue-home',
  standalone: true,
  imports: [
    TopNavComponent,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    RouterLink,
    RxIf,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  toggleSideMenu = new Subject<boolean | void>();

  private store = inject(Store);
  private breakpointObserver = inject(BreakpointObserver);
  private authService = inject(AuthService);

  private state = rxState<{
    isSideMenuOpened: boolean;
    isSmallScreen: boolean;
  }>(({ set, connect }) => {
    // set initial state
    set(() => {
      const isSmallScreen = this.breakpointObserver.isMatched([
        Breakpoints.Small,
        Breakpoints.XSmall,
      ]);
      return { isSmallScreen, isSideMenuOpened: !isSmallScreen };
    });
    // toggle side menu
    connect(
      'isSideMenuOpened',
      this.toggleSideMenu,
      ({ isSideMenuOpened }, isOpened) => {
        return typeof isOpened !== 'undefined' ? isOpened : !isSideMenuOpened;
      }
    );
    connect(
      this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]),
      (oldState, state) => {
        return {
          ...oldState,
          // open side menu on larger screen resize; close if smaller
          isSideMenuOpened: !state.matches,
          isSmallScreen: state.matches,
        };
      }
    );
  });

  user$ = this.store.select(userFeature.selectUser);
  hasNoUser$ = this.user$.pipe(stateful(map((user) => user === null)));
  isSideMenuOpened$ = this.state.select('isSideMenuOpened');
  isSmallScreen$ = this.state.select('isSmallScreen');

  logIn() {
    console.log('here');
  }

  logOut() {
    this.store.dispatch(tryToLogOut());
  }
}
