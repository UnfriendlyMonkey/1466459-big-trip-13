import AbstractView from "./abstract.js";

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input
        visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${type === currentFilterType ? `checked` : ``}
        ${count === 0 ? `disabled` : ``}
      />
      <label class="trip-filters__filter-label ${count === 0 ? `trip-filters__filter-label--disabled` : ``}" for="filter-${type}">${name}</label>
    </div>`
  );
};

export const createTripFiltersTemplate = (filterItems, currentFilterType) => {

  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join(``);

  return `<form class="trip-filters" action="#" method="get">
    ${filterItemsTemplate}
  </form>`;
};

export default class TripFilters extends AbstractView {

  constructor(filters, currentFilterType) {
    super();

    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripFiltersTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    const allowdedFilter = evt.target.classList.contains(`trip-filters__filter-label`)
      && !evt.target.classList.contains(`trip-filters__filter-label--disabled`);
    if (allowdedFilter) {
      this._callback.filterTypeChange(evt.target.innerHTML);
    }
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`click`, this._filterTypeChangeHandler);
  }
}
