import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environment";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, finalize, map, switchMap, take } from "rxjs/operators";
import { RecordsService } from "../../shared/records/services/records.service";
import {
  defaultRecordsState,
  RecordsState,
  RecordsStateModel
} from "../../shared/records/state/records.state";
import { RecommendationStatus } from "../../recommendation/recommendation-history.interface";
import { DEFAULT_SORT } from "../../shared/records/constants";
import { RecommendationsService } from "../services/recommendations.service";
import {
  IGetRecommendationsResponse,
  IRecommendation,
  RecommendationsFilterType
} from "../recommendations.interfaces";
import {
  ClearRecommendationsSearch,
  EnableRecommendationsAllocateAdmin,
  FilterRecommendations,
  GetRecommendations,
  GetRecommendationsError,
  GetRecommendationsSuccess,
  PaginateRecommendations,
  ResetRecommendationsFilter,
  ResetRecommendationsPaginator,
  ResetRecommendationsSort,
  RecommendationsSearch,
  SortRecommendations,
  ToggleAllRecommendationsCheckboxes,
  ToggleRecommendationsCheckbox
} from "./recommendations.actions";

export class RecommendationsStateModel extends RecordsStateModel<
  RecommendationsFilterType,
  IRecommendation[]
> {
  public countTotal: number;
  public countUnderNotice: number;
}

@State<RecommendationsStateModel>({
  name: "recommendations",
  defaults: {
    countTotal: null,
    countUnderNotice: null,
    filter: RecommendationsFilterType.UNDER_NOTICE,
    ...defaultRecordsState
  }
})
@Injectable()
export class RecommendationsState extends RecordsState {
  constructor(
    private recommendationsService: RecommendationsService,
    protected recordsService: RecordsService
  ) {
    super(recordsService);
  }

  @Selector()
  public static countTotal(state: RecommendationsStateModel) {
    return state.countTotal;
  }

  @Selector()
  public static countUnderNotice(state: RecommendationsStateModel) {
    return state.countUnderNotice;
  }

  @Action(GetRecommendations)
  get(ctx: StateContext<RecommendationsStateModel>) {
    const params: HttpParams = this.recommendationsService.generateParams();
    const endPoint = `${environment.appUrls.getRecommendations}`;
    super.getHandler(ctx);

    return this.recordsService
      .getRecords(endPoint, params)
      .pipe(
        take(1),
        map((response: IGetRecommendationsResponse) => {
          response.traineeInfo.forEach(
            (item: IRecommendation) =>
              (item.doctorStatus = RecommendationStatus[item.doctorStatus])
          );
          return response;
        }),
        switchMap((response: IGetRecommendationsResponse) =>
          ctx.dispatch(new GetRecommendationsSuccess(response))
        ),
        catchError((error: string) =>
          ctx.dispatch(new GetRecommendationsError(error))
        ),
        finalize(() =>
          ctx.patchState({
            loading: false
          })
        )
      )
      .subscribe();
  }

  @Action(GetRecommendationsSuccess)
  getSuccess(
    ctx: StateContext<RecommendationsStateModel>,
    action: GetRecommendationsSuccess
  ) {
    super.getSuccessHandler(ctx, action, "traineeInfo");

    return ctx.patchState({
      countTotal: action.response.countTotal,
      countUnderNotice: action.response.countUnderNotice
    });
  }

  @Action(GetRecommendationsError)
  getError(
    ctx: StateContext<RecommendationsStateModel>,
    action: GetRecommendationsError
  ) {
    return super.getErrorHandler(ctx, action);
  }

  @Action(SortRecommendations)
  sort(
    ctx: StateContext<RecommendationsStateModel>,
    action: SortRecommendations
  ) {
    return super.sortHandler(ctx, action);
  }

  @Action(ResetRecommendationsSort)
  resetSort(ctx: StateContext<RecommendationsStateModel>) {
    return super.resetSortHandler(ctx, DEFAULT_SORT);
  }

  @Action(PaginateRecommendations)
  paginate(
    ctx: StateContext<RecommendationsStateModel>,
    action: PaginateRecommendations
  ) {
    return super.paginateHandler(ctx, action);
  }

  @Action(ResetRecommendationsPaginator)
  resetPaginator(ctx: StateContext<RecommendationsStateModel>) {
    return super.resetPaginatorHandler(ctx);
  }

  @Action(RecommendationsSearch)
  search(
    ctx: StateContext<RecommendationsStateModel>,
    action: RecommendationsSearch
  ) {
    return super.searchHandler(ctx, action);
  }

  @Action(ClearRecommendationsSearch)
  clearSearch(ctx: StateContext<RecommendationsStateModel>) {
    return super.clearSearchHandler(ctx);
  }

  @Action(FilterRecommendations)
  filter(
    ctx: StateContext<RecommendationsStateModel>,
    action: FilterRecommendations
  ) {
    return super.filterHandler(ctx, action);
  }

  @Action(ResetRecommendationsFilter)
  resetFilter(ctx: StateContext<RecommendationsStateModel>) {
    return super.resetFilterHandler(
      ctx,
      RecommendationsFilterType.UNDER_NOTICE
    );
  }

  @Action(EnableRecommendationsAllocateAdmin)
  enableAllocateAdmin(
    ctx: StateContext<RecommendationsStateModel>,
    action: EnableRecommendationsAllocateAdmin
  ) {
    return super.enableAllocateAdminHandler(ctx, action.enableAllocateAdmin);
  }

  @Action(ToggleRecommendationsCheckbox)
  toggleCheckbox(
    ctx: StateContext<RecommendationsStateModel>,
    action: ToggleRecommendationsCheckbox
  ) {
    return super.toggleCheckboxHandler(ctx, action);
  }

  @Action(ToggleAllRecommendationsCheckboxes)
  toggleAllCheckboxes(ctx: StateContext<RecommendationsStateModel>) {
    return super.toggleAllCheckboxesHandler(ctx);
  }
}
