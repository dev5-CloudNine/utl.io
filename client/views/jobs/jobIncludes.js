Template.jobLabels.helpers({
  jobSCategory: function() {
    var subCategory = this.jobSubCategory;
    subCategory = encodeURIComponent(subCategory);
    return subCategory;
  }
})