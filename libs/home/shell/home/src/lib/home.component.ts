import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TopNavComponent } from '@item-catalogue/home-ui';
import { Component, inject } from '@angular/core';
import { rxState } from '@rx-angular/state';
import { Subject } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'item-catalogue-home',
  standalone: true,
  imports: [
    TopNavComponent,
    MatSidenavModule,
    AsyncPipe,
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private breakpointObserver = inject(BreakpointObserver);
  toggleSideMenu = new Subject<boolean | void>();
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
  isSideMenuOpened$ = this.state.select('isSideMenuOpened');
  isSmallScreen$ = this.state.select('isSmallScreen');
}
