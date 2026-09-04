import { Component, DestroyRef, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { Project } from '../Projects/models/project';
import { Projects } from '../Projects/services/projects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StatisticsService } from './services/statistics-service';
import { TasksCount, TaskState } from './modals/IStatistic';
import { DatePipe } from '@angular/common';

import { MatDateRangePicker } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController, Plugin } from 'chart.js';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Toastr } from '../../shared/components/success-toastr/service/toastr';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const centerTextPlugin: Plugin<'doughnut'> = {
  id: 'centerText',

  afterDraw(chart) {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);

    if (!meta.data.length) return;

    const x = meta.data[0].x;
    const y = meta.data[0].y;

    ctx.save();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = 'bold 30px Arial';
    ctx.fillStyle = '#222529';

    ctx.fillText(
      String(chart.data.datasets[0].data.reduce((sum, value) => sum + Number(value), 0)),
      x,
      y - 8,
    );

    ctx.font = '14px Arial';
    ctx.fillStyle = '#8C97A7';

    ctx.fillText('Total ', x, y + 20);

    ctx.restore();
  },
};
@Component({
  selector: 'app-statistics',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
  ],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
})
export class Statistics {
  status = [
    'TO_DO',
    'IN_PROGRESS',
    'BLOCKED',
    'IN_REVIEW',
    'READY_FOR_QA',
    'REOPENED',
    'READY_FOR_PRODUCTION',
    'DONE',
  ];
  chartItems: {
    label: string;
    value: number;
    percentage: number;
    color: string;
  }[] = [];

  startDate!: Date;
  endDate!: Date;
  maxEndDate!: Date; //for Validation max 7 days
  @ViewChild('doughnutCanvas') doughnutCanvas!: ElementRef<HTMLCanvasElement>;
  chartData: Record<string, number> | null = null;
  chart!: Chart;
  today = new Date();
  tasksStates = signal<TaskState | null>(null);
  tasks = signal<TasksCount[]>([]);
  projects = signal<Project[]>([]);
  projeService = inject(Projects);
  private destroyRef = inject(DestroyRef);
  statistcsService = inject(StatisticsService);
  toastService = inject(Toastr);

  filterTask = new FormGroup(
    {
      startDate: new FormControl<Date | null>(null),
      endDate: new FormControl<Date | null>(null),
      projectId: new FormControl(null),
      status: new FormControl(null),
    },
    {
      validators: this.dateRangeValidator,
    },
  );

  @ViewChild('rangePicker')
  rangePicker!: MatDateRangePicker<Date>;

  ngOnInit() {
    this.getCurrentWeek();
    this.getProjects();
    this.getTasksInRange(this.startDate, this.endDate);
    this.getTasksPerProj();
  }

  // ngAfterViewInit() {
  //   if (this.chartData) {
  //     this.createChart(this.chartData);
  //   }
  // }

  getProjects() {
    this.projeService
      .getProject()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.projects.set(res);
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  onFilterChange() {
    const projectId = this.filterTask.get('projectId')?.value;
    const status = this.filterTask.get('status')?.value;

    const start = this.startDate.toISOString().split('T')[0];
    const end = this.endDate.toISOString().split('T')[0];

    this.statistcsService
      .getTasksInRange(start, end, projectId!, status!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.tasksStates.set(res);

          this.chartData = res.totals;

          if (this.doughnutCanvas) {
            this.createChart(res.totals);
          }
        },
      });

    this.statistcsService
      .getTasksPerProj(start, end)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.tasks.set(res);
        },
      });
  }


  getTasksInRange(start: Date, end: Date) {
    const startD = start.toISOString().split('T')[0];
    const endD = end.toISOString().split('T')[0];

    this.statistcsService
      .getTasksInRange(startD, endD)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.tasksStates.set(res);
          this.chartData = res.totals;
          if (this.doughnutCanvas) {
            this.createChart(this.chartData);
          }
        },
      });
  }

  getStatusKeys(statuses: Record<string, number>): string[] {
    return Object.keys(statuses);
  }

  getTasksPerProj() {
    const start = this.startDate.toISOString().split('T')[0];
    const end = this.endDate.toISOString().split('T')[0];
    this.statistcsService
      .getTasksPerProj(start, end)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.tasks.set(res);
          console.log(this.tasks());
        },
      });
  }

  getPreviousWeek() {
    this.startDate = new Date(this.startDate);
    this.endDate = new Date(this.endDate);

    this.startDate.setDate(this.startDate.getDate() - 7);

    this.endDate.setDate(this.endDate.getDate() - 7);

    this.updateMaxEndDate();

    this.getTasksInRange(this.startDate, this.endDate);
    this.getTasksPerProj();
  }

  getNextWeek() {
    this.startDate = new Date(this.startDate);
    this.endDate = new Date(this.endDate);

    this.startDate.setDate(this.startDate.getDate() + 7);

    this.endDate.setDate(this.endDate.getDate() + 7);

    this.updateMaxEndDate();

    this.getTasksInRange(this.startDate, this.endDate);
    this.getTasksPerProj();
  }

  getCurrentWeek() {
    const day = this.today.getDay();
    const diff = day === 0 ? -6 : 1 - day;

    this.startDate = new Date(this.today);
    this.startDate.setDate(this.today.getDate() + diff);

    this.endDate = new Date(this.startDate);
    this.endDate.setDate(this.startDate.getDate() + 6);

    this.maxEndDate = new Date(this.startDate);
    this.maxEndDate.setDate(this.startDate.getDate() + 6);

    this.filterTask.patchValue({
      startDate: this.startDate,
      endDate: this.endDate,
    });
  }

  cancelRange() {
    this.filterTask.patchValue({
      startDate: this.startDate,
      endDate: this.endDate,
    });

    this.updateMaxEndDate();
  }

  applyRange() {
    const start = this.filterTask.get('startDate')?.value;
    const end = this.filterTask.get('endDate')?.value;

    if (!start || !end) return;

    this.startDate = new Date(start);
    this.endDate = new Date(end);
    this.filterTask.updateValueAndValidity();

    if (this.filterTask.hasError('maxRange')) {
      this.toastService.error('Max range: 7 days', 'top-right');
      return;
    }
    this.getTasksInRange(this.startDate, this.endDate);
    this.getTasksPerProj();
  }

  onChangeStartDate(date: Date | null) {
    if (!date) return;
    this.startDate = new Date(date);
    // this.updateMaxEndDate();
    this.filterTask.patchValue({
      startDate: date,
      endDate: null,
    });
  }

  onChangeEndDate(date: Date | null) {
    if (!date) return;
    this.endDate = new Date(date);
    this.filterTask.updateValueAndValidity();

    if (this.filterTask.hasError('maxRange')) {
      this.toastService.error('Max range: 7 days', 'top-right');
      return;
    }

  }

  //max 7 days validation
  updateMaxEndDate() {
    this.maxEndDate = new Date(this.startDate);
    this.maxEndDate.setDate(this.maxEndDate.getDate() + 6);
  }

  dateRangeValidator(control: AbstractControl) {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;

    if (!startDate || !endDate) {
      return null;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

    return diff > 6 ? { maxRange: true } : null;
  }

  getDayName(day: string): string {
    return new Date(day).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  }



  createChart(totals: Record<string, number>) {
    const data = Object.values(totals);
    const labels = Object.keys(totals);

    const colors = [
      '#003D9B',
      '#004E32',
      '#BA1A1A',
      '#C3C6D6',
      '#E0E8FF',
      '#FFB86C',
      '#67E8F9',
      '#94A3B8',
    ];
    const total = data.reduce((sum, value) => sum + value, 0);

    this.chartItems = labels.map((label, index) => ({
      label: label.replaceAll('_', ' '),
      value: data[index],
      percentage: (data[index] / total) * 100,
      color: colors[index],
    }));

    if (this.chart) {
      this.chart.data.labels = labels.map((status) => status.replaceAll('_', ' '));
      this.chart.data.datasets[0].data = data;
      this.chart.update();
    }

    this.chart = new Chart(this.doughnutCanvas?.nativeElement, {
      type: 'doughnut',
      data: {
        labels: labels.map((status) => status.replaceAll('_', ' ')),
        datasets: [
          {
            data: data,
            backgroundColor: colors,
          },
        ],
      },
      options: {
        responsive: true,

        cutout: '60%',

        plugins: {
          legend: {
            display: false,
          },
        },
      },
      plugins: [centerTextPlugin],
    });
  }
}
