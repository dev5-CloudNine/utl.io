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
    }
  },
  autoForm:{
    omitFields: ['createdAt','updatedAt']
  }
};
