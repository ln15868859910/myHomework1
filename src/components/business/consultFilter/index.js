import consultFilter from './filter.vue';
import consultFilterSingle from './filter-single.vue';
import consultFilterMulti from './filter-multi.vue';
import consultFilterrUnion from './filter-union.vue';
import consultFilterSlot from './filter-slot.vue';

consultFilter.single = consultFilterSingle;
consultFilter.multi = consultFilterMulti;
consultFilter.union = consultFilterrUnion;
consultFilter.slot = consultFilterSlot;

export default consultFilter;