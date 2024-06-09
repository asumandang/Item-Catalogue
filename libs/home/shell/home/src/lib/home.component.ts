import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TopNavComponent } from '@item-catalogue/home-ui';
import { Component, inject } from '@angular/core';
import { rxState } from '@rx-angular/state';
import { Subject } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AsyncPipe } from '@angular/common';
import { RouterModule, provideRouter } from '@angular/router';
import { homeRoutes } from './home.routes';

@Component({
  selector: 'item-catalogue-home',
  standalone: true,
  imports: [TopNavComponent, MatSidenavModule, AsyncPipe, RouterModule],
  providers: [provideRouter(homeRoutes)],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private breakpointObserver = inject(BreakpointObserver);
  toggleSideMenu = new Subject<void>();
  private state = rxState<{
    isSideMenuOpened: boolean;
    isSmallScreen: boolean;
  }>(({ set, connect }) => {
    // set initial state
    set({ isSideMenuOpened: true });
    // toggle side menu
    connect(
      'isSideMenuOpened',
      this.toggleSideMenu,
      ({ isSideMenuOpened }) => !isSideMenuOpened
    );
    connect(
      'isSmallScreen',
      this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]),
      (_isSmallScreen, state) => {
        return state.matches;
      }
    );
  });
  isSideMenuOpened$ = this.state.select('isSideMenuOpened');
  isSmallScreen$ = this.state.select('isSmallScreen');
}
