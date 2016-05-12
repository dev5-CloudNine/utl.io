AdminConfig = {
  name: 'UTL Admin',
  collections: {
    Jobs: {
      icon: 'briefcase',
      tableColumns: [
        {label: 'ID', name: '_id'},
        {label: 'Title', name: 'title'},
        {label: 'User Name', name: 'userName'},
        {label: 'Status', name: 'status'}
      ],
      color: 'red'
    },
    Profiles: {
      icon: 'file-text-o',
      tableColumns: [
        {label: 'ID', name: '_id'},
        {label: 'Title', name: 'title'},
        {label: 'User Name', name: 'userName'},
        {label: 'Status', name: 'status'}
      ],
      color: 'green'
    },
    Buyers: {
      icon: 'bank',
      tableColumns: [
        {label: 'ID', name: '_id'},
        {label: 'Title', name: 'title'},
        {label: 'User Name', name: 'userName'},
        {label: 'Status', name: 'status'},
      ],
      color: 'blue'
    },
    Corporates: {
      icon: 'users',
      tableColumns: [
        {label: 'ID', name: '_id'},
        {label: 'Title', name: 'title'},
        {label: 'User Name', name: 'userName'},
        {label: 'Status', name: 'status'}
      ]
    },
    Categories: {
      icon: 'list',
      tableColumns: [
        {label: 'ID', name: "_id"},
        {label: 'Category', name: 'label'}
      ]
    },
    SubCategories: {
      icon: 'list-alt',
      tableColumns: [
        {label: 'ID', name: "_id"},
        {label: 'Category', name: 'parentId'},
        {label: 'Sub Category', name: 'label'}
      ]
    }
  },
  autoForm:{
    omitFields: ['createdAt','updatedAt']
  }
};
