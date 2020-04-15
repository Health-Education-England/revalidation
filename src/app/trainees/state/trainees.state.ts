import { HttpParams } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { State, Action, StateContext, Selector } from "@ngxs/store";
import { tap } from "rxjs/operators";
import { DEFAULT_SORT } from "../../core/trainee/constants";
import { ITrainee } from "../../core/trainee/trainee.interfaces";
import { TraineeService } from "../../core/trainee/trainee.service";
import {
  ClearTraineesSearch,
  GetTrainees,
  PaginateTrainees,
  ResetTraineesPaginator,
  ResetTraineesSort,
  SearchTrainees,
  SortTrainees,
  UpdateTraineesRoute
} from "./trainees.actions";

export class TraineesStateModel {
  public items: ITrainee[];
  public countTotal: number;
  public loading: boolean;
  public sort: Sort;
  public pageIndex: number;
  public searchQuery: string;
}

@State<TraineesStateModel>({
  name: "trainees",
  defaults: {
    items: null,
    countTotal: null,
    loading: null,
    sort: {
      active: null,
      direction: null
    },
    pageIndex: 0,
    searchQuery: null
  }
})
@Injectable()
export class TraineesState {
  constructor(
    private traineeService: TraineeService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  @Selector()
  public static trainees(state: TraineesStateModel) {
    return state.items;
  }

  @Selector()
  public static loading(state: TraineesStateModel) {
    return state.loading;
  }

  @Selector()
  public static sort(state: TraineesStateModel) {
    return state.sort;
  }

  @Selector()
  public static countTotal(state: TraineesStateModel) {
    return state.countTotal;
  }

  @Selector()
  public static pageIndex(state: TraineesStateModel) {
    return state.pageIndex;
  }

  @Selector()
  public static searchQuery(state: TraineesStateModel) {
    return state.searchQuery;
  }

  @Action(GetTrainees)
  getTrainees(ctx: StateContext<TraineesStateModel>) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      items: null,
      loading: true
    });

    let params = new HttpParams().set("pageNumber", state.pageIndex.toString());

    if (state.sort.direction) {
      params = params
        .append("sortColumn", state.sort.active)
        .append("sortOrder", state.sort.direction);
    }

    if (state.searchQuery) {
      params = params.append("searchQuery", state.searchQuery);
    }

    return this.traineeService.getTrainees(params).pipe(
      tap((result) => {
        ctx.setState({
          ...state,
          items: result.traineeInfo,
          countTotal: result.countTotal,
          loading: false
        });
      })
    );
  }

  @Action(SortTrainees)
  sortTrainees(ctx: StateContext<TraineesStateModel>, action: SortTrainees) {
    const state = ctx.getState();
    return ctx.setState({
      ...state,
      sort: {
        active: action.column,
        direction: action.direction
      }
    });
  }

  @Action(ResetTraineesSort)
  resetTraineesSort(ctx: StateContext<TraineesStateModel>) {
    const state = ctx.getState();
    return ctx.setState({
      ...state,
      sort: DEFAULT_SORT
    });
  }

  @Action(PaginateTrainees)
  paginateTrainees(
    ctx: StateContext<TraineesStateModel>,
    action: PaginateTrainees
  ) {
    const state = ctx.getState();
    return ctx.setState({
      ...state,
      pageIndex: action.pageIndex
    });
  }

  @Action(ResetTraineesPaginator)
  resetTraineesPaginator(ctx: StateContext<TraineesStateModel>) {
    const state = ctx.getState();
    return ctx.setState({
      ...state,
      pageIndex: 0
    });
  }

  @Action(UpdateTraineesRoute)
  updateTraineesRoute(ctx: StateContext<TraineesStateModel>) {
    const state = ctx.getState();
    return this.ngZone.run(() =>
      this.router.navigate(["/trainees"], {
        queryParams: {
          active: state.sort.active,
          direction: state.sort.direction,
          pageIndex: state.pageIndex,
          ...(state.searchQuery && { searchQuery: state.searchQuery })
        }
      })
    );
  }

  @Action(SearchTrainees)
  searchTrainees(
    ctx: StateContext<TraineesStateModel>,
    action: SearchTrainees
  ) {
    return ctx.patchState({
      searchQuery: action.searchQuery
    });
  }

  @Action(ClearTraineesSearch)
  clearTraineesSearch(ctx: StateContext<TraineesStateModel>) {
    return ctx.patchState({
      searchQuery: null
    });
  }
}
