class TaskService {
    private static instance;
    private static count = 0;
    public observerList: Observer[] = [];
    public taskList: Task[] = [];

    constructor() {
        TaskService.count++;
        if (TaskService.count > 1) {
            throw 'singleton!';
        }
    }

    public static getInstance() {
        if (TaskService.instance == null) {
            TaskService.instance = new TaskService();
        }
        return TaskService.instance;
    }

    public accept(id: string): void {

        for (var i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].id == id) {
                this.taskList[i].status = TaskStatus.DURING;
            }
        }
        this.notify();

    }

    public finish(id: string): ErrorCode {

        if (!id) {
            return ErrorCode.TASK_MISSING;
        }

        for (var i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].id == id) {
                this.taskList[i].status = TaskStatus.SUBMITTED;
            }
        }

        this.notify();
        return ErrorCode.SUCCEED;
    }

    public getTaskByCustomRole(rule: Function): Task {
        return rule(this.taskList);
    }

    public notify(): void {

        for (var i = 0; i < this.taskList.length; i++) {
            for (var observer of this.observerList) {
                observer.onChange(this.taskList[i]);
            }
        }
    }

}

