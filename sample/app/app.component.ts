import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppService } from './app.service';
import { ComponentPool } from '@sedeh/into-pipes';

import { SelectService } from './select.service';
import {
  ChangedtemsInfo,
  FilteredItemsInfo,
  FlexibleTableHeader,
  PaginationInfo,
  PaginationType,
  StylePositionInterface,
  StyleServiceInterface,
  TableHeadersGenerator,
} from '@sedeh/flexible-table';

class StylerService implements StyleServiceInterface {
  private allowAltColor = false;
  activate(flag: boolean) {
    this.allowAltColor = flag;
  }
  styleFor(location: StylePositionInterface) {
    if (this.allowAltColor) {
      switch (location.type) {
        case 'header':
          return location.header?.key === 'age'
            ? 'background-color: red;color: black'
            : 'background-color: #efefef;color: black';
        case 'filters':
          return location.header?.key === 'age'
            ? 'background-color: red;color: black'
            : 'background-color: #efefef;color: black';
        case 'row':
          return location.item
            ? location.item.age === 31
              ? location.header?.key === 'age'
                ? 'background-color: green;color: white'
                : 'background-color: red;color: white'
              : location.header?.key === 'age'
              ? 'background-color: red;color: white'
              : ''
            : '';
        case 'detail':
          return location.item?.age === 31
            ? 'background-color: green;color: white'
            : 'background-color: #eee;';
      }
    }
    return '';
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Flexible Table';
  styler: any;
  enableRowCount = false;
  enableLockRowCount = true;
  enableFiltering = false;
  enableLockFiltering = false;
  configurable = false;
  lockConfigurable = false;
  filterTyping = false;
  filterLockTyping = false;
  showActionable = true;
  showAltColor = false;

  selectedActivateOption = '';
  selectedDisableOption = '';
  selectedDisplayModeOption = '';
  selectedValidationOption = '';
  selectedLock = '';

  booleanOptions = ['true', 'false'];
  cityOptions = [
    'Wyoming',
    'Seymour',
    'Loveland',
    'Marienthal',
    'Machias',
    'Forestburg',
    'Cumberland',
  ];

  selectedPagination = 'No pagination';
  selectedLockPagination = 'No pagination';
  inlinePagination: PaginationType = PaginationType.none;
  inlineLockPagination: PaginationType = PaginationType.none;
  samplers = [
    PaginationType.none,
    PaginationType.floating,
    PaginationType.ontop,
    PaginationType.onbottom,
    PaginationType.topbottom,
  ];
  paginationOptions = [
    'No pagination',
    'Floating pagination',
    'Pagination on top',
    'Pagination on bottom',
    'Pagination on top and Bottom',
  ];

  userPageInfo: PaginationInfo = {
    defaultSize: 8,
    pageSize: 8,
    currentPage: 1,
    from: 0,
    to: 8,
    pages: 1,
    resetSize: true,
    contentSize: 0,
  };
  lockPageInfo: PaginationInfo = {
    defaultSize: 8,
    pageSize: 8,
    currentPage: 1,
    from: 0,
    to: 8,
    pages: 1,
    resetSize: true,
    contentSize: 0,
  };

  usersHeader: FlexibleTableHeader[] = [
    {
      key: 'registered',
      active: true,
      disabled: false,
      value: 'Registered On',
      present: true,
      dragable: true,
      dropable: true,
      sortable: true,
      format: 'calendar:MM/dd/yyyy',
    },
    {
      key: 'name',
      active: true,
      disabled: false,
      value: 'Name',
      present: true,
      dragable: true,
      dropable: true,
      sortable: true,
      format: [
        'input:::false',
        'toggler:name:icon fa fa-plus-square-o:icon fa fa-minus-square-o',
      ],
      filter: '',
    },
    {
      key: 'age',
      active: true,
      disabled: false,
      value: 'age',
      present: true,
      dragable: true,
      dropable: true,
      sortable: true,
      format: 'input:::false',
      filter: '',
    },
    {
      key: 'isActive',
      active: true,
      disabled: false,
      value: 'Active',
      present: true,
      dragable: true,
      dropable: true,
      sortable: true,
      format: 'checkbox:true:false:false:false',
      filterOptions: this.booleanOptions,
    },
    {
      key: 'picture',
      active: true,
      disabled: false,
      value: 'Picture',
      present: true,
      dragable: true,
      dropable: true,
      sortable: true,
      format: 'image:::::',
      hideOnPrint: true,
    },
    {
      key: 'address.city',
      active: true,
      disabled: false,
      value: 'City',
      present: true,
      dragable: true,
      dropable: true,
      sortable: true,
      format: 'input:::false',
      filterOptions: this.cityOptions,
    },
    {
      key: 'company',
      active: true,
      disabled: false,
      value: 'Company',
      present: true,
      dragable: true,
      dropable: true,
      sortable: true,
      format: 'select:false:true',
      filter: '',
    },
  ];

  lockHeader: FlexibleTableHeader[] = [
    {
      key: 'registered',
      lockable: true,
      active: true,
      disabled: false,
      value: 'Registered On',
      present: true,
      dragable: true,
      dropable: true,
      sortable: true,
      format: 'calendar:MM/dd/yyyy',
    },
    {
      key: 'name',
      lockable: true,
      active: true,
      disabled: false,
      value: 'Name',
      present: true,
      dragable: true,
      dropable: true,
      sortable: true,
      format: 'input:::false',
      filter: '',
    },
    {
      key: 'balance',
      lockable: true,
      active: true,
      disabled: false,
      value: 'Balance',
      present: true,
      dragable: true,
      dropable: true,
      sortable: true,
      format: 'currency',
      filter: '',
    },
    {
      key: 'age',
      lockable: true,
      active: true,
      disabled: false,
      value: 'age',
      present: true,
      dragable: true,
      dropable: true,
      sortable: true,
      format: 'input:::falsetrue',
      filter: '',
    },
    {
      key: 'isActive',
      lockable: true,
      active: true,
      disabled: false,
      value: 'Active',
      present: true,
      dragable: true,
      dropable: true,
      sortable: true,
      format: 'checkbox:true:false:false:false',
    },
    {
      key: 'picture',
      lockable: true,
      active: true,
      disabled: false,
      value: 'Picture',
      present: true,
      dragable: true,
      dropable: true,
      sortable: true,
      format: 'image:::::',
      hideOnPrint: true,
    },
    {
      key: 'address.city',
      lockable: true,
      active: true,
      disabled: false,
      value: 'City',
      present: true,
      dragable: true,
      dropable: true,
      sortable: true,
      format: 'input:::falsetrue',
      filter: '',
    },
    {
      key: 'company',
      lockable: true,
      active: true,
      disabled: false,
      value: 'Company',
      present: true,
      dragable: true,
      dropable: true,
      sortable: true,
      format: 'select:false:true',
      filter: '',
    },
  ];

  activationOptions = [
    'Tab focus on all formatters',
    'No tab focus on any formatter',
    'Tab focus only on Name column',
  ];
  disableEditOptions = [
    'All formatters are editable',
    'None of formatter are editable',
    'Only Company column is editable',
  ];
  displayModeOptions = [
    'Click toggle on all formatters',
    'All formatters on edit mode',
    'Only name column on edit mode',
  ];
  validationOptions = [
    'Change any formatter without validation',
    'Change any formatters if validates',
    'Only company column should validate',
  ];
  lockOptions = [
    'Show lock on all columns',
    'No lock on any column',
    'Show lock on company and name columns',
  ];

  users: any[] = [];
  lockUsers: any[] = [];
  usersService!: any;
  lockService!: any;

  events: any[] = [];

  constructor(
    private client: HttpClient,
    private generator: TableHeadersGenerator,
    private pool: ComponentPool
  ) {
    this.usersService = new AppService();
    this.lockService = new AppService();
    this.pool.registerServiceForComponent('select', new SelectService());
    this.usersHeader.map(
      (h: FlexibleTableHeader) => (h.validate = this.noValidationNeeded.bind(h))
    );
  }

  ngOnInit() {
    this.styler = new StylerService();

    this.styler.activate(this.showAltColor);
    this.usersService
      .getData(this.userPageInfo, this.usersHeader)
      .subscribe((users: any[]) => {
        this.users = users;
        this.userPageInfo.contentSize = this.users.length;
        this.userPageInfo.pages =
          this.users.length / this.userPageInfo.defaultSize;
      });
    this.lockService
      .getData(this.userPageInfo, this.usersHeader)
      .subscribe((lockTableUsers: any[]) => {
        this.lockUsers = lockTableUsers;
        this.lockPageInfo.contentSize = this.lockUsers
          ? this.lockUsers.length
          : 0;
        this.lockPageInfo.pages =
          this.lockUsers.length / this.lockPageInfo.defaultSize;
      });
  }

  performValidation(row: any, value: any) {
    // this should refere t header.
    const x: any = this;
    alert('New value "' + value + '" validated for ' + x.key + ' column!!');
    return true;
  }
  noValidationNeeded(row: any, value: any) {
    return true;
  }
  allowExpanding(item: any, showIcon: boolean) {
    return showIcon;
  }

  popAlert(message: string) {
    alert(message);
  }
  onaction(event: any) {
    this.events.push({
      time: new Date().getTime(),
      index: event.index,
      table: event.tableInfo,
      action: event.action,
      item: event.row.name,
    });
  }
  onconfigurationchange(event: ChangedtemsInfo) {
    this.events.push({
      time: new Date().getTime(),
      table: event.tableInfo,
      action: event.action,
      from: event.sourceIndex,
      to: event.destinationIndex,
      items: event.headers?.map((item: FlexibleTableHeader) => item.key),
    });
  }

  onCellEdit(event: any) {
    if (event.pageInfo === 'users table') {
      const oldValue = '' + event.item[event.key];
      const users = JSON.parse(JSON.stringify(this.users));
      users[event.index][event.key] = event.value;
      this.users = users; // forcing it to redraw
      this.events.push({
        time: new Date().getTime(),
        table: event.tableInfo,
        action: 'change',
        attribute: event.key,
        from: oldValue,
        to: event.value,
      });
    } else {
      const oldValue = '' + event.item[event.key];
      const users = JSON.parse(JSON.stringify(this.lockUsers));
      users[event.index][event.key] = event.value;
      this.lockUsers = users; // forcing it to redraw
      this.events.push({
        time: new Date().getTime(),
        table: event.tableInfo,
        action: 'change',
        attribute: event.key,
        from: oldValue,
        to: event.value,
      });
    }
  }
  onfilter(event: FilteredItemsInfo) {
    let items = event.items;
    if (items instanceof Array) {
      items = event.items?.map((item: any) => item.name);
    }
    this.events.push({
      time: new Date().getTime(),
      table: event.tableInfo,
      filters: event.filters,
      data: items,
    });
  }
  log(message: string) {
    console.log(message);
  }
  keyup(event: any) {}
  private updateFormat(
    header: FlexibleTableHeader,
    key: string,
    newKey: string
  ) {
    if (header.format instanceof Array) {
      const list: string[] = header.format;
      list.map((item: string, i: number) => {
        if (item.indexOf(key) > -1) {
          list[i] = newKey;
        }
      });
    } else if (header.format && header.format.indexOf(key) > -1) {
      header.format = newKey;
    }
  }
  displayModeSelection(event: any) {
    const t = this.users;
    this.users = [];
    this.selectedDisplayModeOption = event.target.value;
    if (event.target.selectedIndex === 0) {
      this.usersHeader.map((h: FlexibleTableHeader) =>
        this.updateFormat(h, 'input:::true', 'input:::false')
      );
      this.usersHeader.map((h: FlexibleTableHeader) =>
        this.updateFormat(h, 'select:false:true', 'select:false')
      );
    } else if (event.target.selectedIndex === 1) {
      this.usersHeader.map((h: FlexibleTableHeader) =>
        this.updateFormat(h, 'input:::false', 'input:::true')
      );
      this.usersHeader.map((h: FlexibleTableHeader) =>
        this.updateFormat(h, 'select:false', 'select:false:true')
      );
    } else if (event.target.selectedIndex === 2) {
      this.usersHeader.map((h: FlexibleTableHeader) =>
        this.updateFormat(
          h,
          'input:::false',
          h.key === 'name' ? 'input:::true' : 'input:::false'
        )
      );
      this.usersHeader.map((h: FlexibleTableHeader) =>
        this.updateFormat(
          h,
          'select:false',
          h.key === 'name' ? 'select:false:true' : 'select:false'
        )
      );
    }
    setTimeout(() => (this.users = t), 0);
  }
  lockSelection(event: any) {
    this.selectedLock = event.target.value;
    const users = this.lockUsers;
    if (event.target.selectedIndex === 0) {
      this.lockHeader.map((h: FlexibleTableHeader) => (h.lockable = true));
    } else if (event.target.selectedIndex === 1) {
      this.lockHeader.map((h: FlexibleTableHeader) => (h.lockable = false));
    } else if (event.target.selectedIndex === 2) {
      this.lockHeader.map((h: FlexibleTableHeader) => (h.lockable = false));
      this.lockHeader.map(
        (h: FlexibleTableHeader) =>
          (h.locked = h.key === 'company' || h.key === 'name')
      );
    }
    this.lockUsers = [];
    setTimeout(() => {
      this.lockUsers = users;
    }, 0);
  }
  validationSelection(event: any) {
    this.selectedDisplayModeOption = event.target.value;
    if (event.target.selectedIndex === 0) {
      this.usersHeader.map(
        (h: FlexibleTableHeader) =>
          (h.validate = this.noValidationNeeded.bind(h))
      );
    } else if (event.target.selectedIndex === 1) {
      this.usersHeader.map(
        (h: FlexibleTableHeader) =>
          (h.validate = this.performValidation.bind(h))
      );
    } else if (event.target.selectedIndex === 2) {
      this.usersHeader.map(
        (h: FlexibleTableHeader) =>
          (h.validate =
            h.key === 'company'
              ? this.performValidation.bind(h)
              : this.noValidationNeeded.bind(h))
      );
    }
  }
  editSelection(event: any) {
    this.selectedDisableOption = event.target.value;
    if (event.target.selectedIndex === 0) {
      this.usersHeader.map((h: FlexibleTableHeader) => (h.disabled = false));
    } else if (event.target.selectedIndex === 1) {
      this.usersHeader.map((h: FlexibleTableHeader) => (h.disabled = true));
    } else if (event.target.selectedIndex === 2) {
      this.usersHeader.map(
        (h: FlexibleTableHeader) => (h.disabled = h.key === 'company')
      );
    }
  }
  activationSelection(event: any) {
    this.selectedActivateOption = event.target.value;
    if (event.target.selectedIndex === 0) {
      this.usersHeader.map((h: FlexibleTableHeader) => (h.active = true));
    } else if (event.target.selectedIndex === 1) {
      this.usersHeader.map((h: FlexibleTableHeader) => (h.active = false));
    } else if (event.target.selectedIndex === 2) {
      this.usersHeader.map(
        (h: FlexibleTableHeader) => (h.active = h.key != 'name')
      );
    }
  }
  lockPaginationSelection(event: any) {
    this.selectedLockPagination =
      this.paginationOptions[event.target.selectedIndex];
    this.inlineLockPagination = this.samplers[event.target.selectedIndex];
  }
  paginationSelection(event: any) {
    this.selectedPagination =
      this.paginationOptions[event.target.selectedIndex];
    this.inlinePagination = this.samplers[event.target.selectedIndex];
  }
  feedFrom(input: any) {
    this.client.get(input.value).subscribe(
      (result: any) => {
        if (result) {
          let file: any;
          if (result instanceof Object) {
            file = result;
          } else {
            file = JSON.parse(result);
          }
          this.usersService = undefined;

          setTimeout(() => {
            this.usersHeader = this.generator.generateHeadersFor(
              file[0],
              '',
              5,
              this.enableFiltering
            );
            this.showActionable = false;
            this.usersService = new AppService(file);
          }, 666);
        }
      },
      (error) =>
        alert(
          'Failed to load "' +
            input.value +
            '". please validate if this URL is correct'
        )
    );
  }
  click(event: any, attr: any) {
    const checked = event.target.checked;
    switch (attr) {
      case 'enableRowCount':
        this.enableRowCount = checked;
        break;
      case 'enableLockRowCount':
        this.enableLockRowCount = checked;
        break;
      case 'showActionable':
        this.showActionable = checked;
        break;
      case 'enableFiltering':
        this.enableFiltering = checked;
        break;
      case 'enableLockFiltering':
        this.enableLockFiltering = checked;
        break;
      case 'configurable':
        this.configurable = checked;
        break;
      case 'lockConfigurable':
        this.lockConfigurable = checked;
        break;
      case 'filterTyping':
        this.filterTyping = checked;
        break;
      case 'filterLockTyping':
        this.filterLockTyping = checked;
        break;
      case 'showAltColor':
        this.showAltColor = checked;
        this.styler.activate(this.showAltColor);
        break;
    }
  }
}
