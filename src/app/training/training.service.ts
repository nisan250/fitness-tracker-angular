import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Exercise } from './exercise.model';
import { UiService } from '../shared/ui.service';

import { Store } from '@ngrx/store';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private fbSubscriptions: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
    private store: Store<fromTraining.State>
  ) {}

  fetchAvailableExercises(): void {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubscriptions.push(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map((docArray) =>
            docArray.map((doc) => {
              const data = doc.payload.doc.data() as any;
              const id = doc.payload.doc.id;
              return {
                id: id,
                name: data.name,
                duration: data.duration,
                calories: data.calories,
              };
            })
          )
        )
        .subscribe(
          (exercises: Exercise[]) => {
            this.store.dispatch(new UI.StopLoading());
            this.store.dispatch(new Training.SetAvailableTrainings(exercises));
          },
          (error) => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackBar(
              'Fetching Exercises failed, please try again later',
              null,
              3000
            );
          }
        )
    );
  }

  startExercise(selectedId: string): void {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise(): void {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        this.addDataToDatabase({
          ...ex,
          date: new Date(),
          state: 'completed',
        });
      });
    this.store.dispatch(new Training.StopTraining());
  }

  cancleExercise(progress: number): void {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        this.addDataToDatabase({
          ...ex,
          duration: ex.duration * (progress / 100),
          calories: ex.calories * (progress / 100),
          date: new Date(),
          state: 'cancelled',
        });
      });
    this.store.dispatch(new Training.StopTraining());
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubscriptions.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          this.store.dispatch(new Training.SetFinishedTrainings(exercises));
        })
    );
  }

  addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions() {
    this.fbSubscriptions.forEach((sub) => sub.unsubscribe());
  }
}
