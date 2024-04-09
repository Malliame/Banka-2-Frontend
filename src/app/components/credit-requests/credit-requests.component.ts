import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CreditService } from 'src/app/services/credit.service';
import { AuthService } from 'src/app/services/auth.service';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { CreateCreditRequestDto } from 'src/app/dtos/create-credit-request-dto';
import { CreditReqInfoDialogComponent } from './credit-req-info-dialog/credit-req-info-dialog.component';

@Component({
	selector: 'app-credit-requests',
	templateUrl: './credit-requests.component.html',
	styleUrls: ['./credit-requests.component.css'],
})
export class CreditRequestsComponent implements AfterViewInit {
	displayedColumns: string[] = [
		'id',
		'accountNumber',
		'mobileNumber',
		'creditType',
		'creditAmount',
		'currency',
		'creditPurpose',
	];
	dataSource = new MatTableDataSource<CreateCreditRequestDto>();
	selectedRow: CreateCreditRequestDto | null = null;

	@ViewChild(MatPaginator) paginator: MatPaginator | undefined;
	@ViewChild(MatSort) sort: MatSort | undefined;

	constructor(
		private http: HttpClient,
		private authService: AuthService,
		private creditService: CreditService,
		public dialog: MatDialog,
	) {
		this.dataSource = new MatTableDataSource();
		this.fetchAllData();
	}

	ngAfterViewInit() {
		if (this.paginator) this.dataSource.paginator = this.paginator;
		if (this.sort) this.dataSource.sort = this.sort;
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	selectRow(row: CreateCreditRequestDto): void {
		if (this.selectedRow?.id != row.id) {
			this.selectedRow = row;
		}
	}

	viewCreditRequest(row: CreateCreditRequestDto): void {
		if (this.selectedRow != null) {
			const dialogRef = this.dialog.open(CreditReqInfoDialogComponent, {
				data: { selectedRow: row },
			});
		}
	}

	fetchAllData(): void {
		this.creditService
			.getFindAllCreditRequests()
			.pipe(
				map(dataSource => {
					this.dataSource.data = dataSource;
					return dataSource;
				}),
				catchError(error => {
					console.error('Error loading data.', error);
					return throwError(() => error);
				}),
			)
			.subscribe();
	}
}
