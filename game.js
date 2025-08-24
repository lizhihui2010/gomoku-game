// 五子棋游戏核心逻辑
class GomokuGame {
    constructor() {
        // 游戏配置常量
        this.BOARD_SIZE = 15; // 棋盘大小 15x15
        this.CELL_SIZE = 40; // 每个格子的大小
        this.BOARD_PADDING = 20; // 棋盘边距
        
        // 游戏状态
        this.currentPlayer = 'black'; // 当前玩家，黑棋先手
        this.gameBoard = []; // 棋盘数组
        this.gameHistory = []; // 游戏历史记录
        this.gameOver = false; // 游戏是否结束
        
        // 获取DOM元素
        this.canvas = document.getElementById('gameBoard');
        this.ctx = this.canvas.getContext('2d');
        this.currentPlayerElement = document.getElementById('currentPlayer');
        this.gameStatusElement = document.getElementById('gameStatus');
        this.restartBtn = document.getElementById('restartBtn');
        this.undoBtn = document.getElementById('undoBtn');
        
        // 初始化游戏
        this.initGame();
        this.bindEvents();
    }
    
    // 初始化游戏
    initGame() {
        // 初始化棋盘数组
        this.gameBoard = Array(this.BOARD_SIZE).fill(null).map(() => 
            Array(this.BOARD_SIZE).fill(null)
        );
        
        // 重置游戏状态
        this.currentPlayer = 'black';
        this.gameHistory = [];
        this.gameOver = false;
        
        // 更新UI显示
        this.updateGameInfo();
        this.drawBoard();
    }
    
    // 绘制棋盘
    drawBoard() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 设置棋盘背景色
        this.ctx.fillStyle = '#DEB887';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格线
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 1;
        
        // 绘制横线
        for (let i = 0; i < this.BOARD_SIZE; i++) {
            const y = this.BOARD_PADDING + i * this.CELL_SIZE;
            this.ctx.beginPath();
            this.ctx.moveTo(this.BOARD_PADDING, y);
            this.ctx.lineTo(this.BOARD_PADDING + (this.BOARD_SIZE - 1) * this.CELL_SIZE, y);
            this.ctx.stroke();
        }
        
        // 绘制竖线
        for (let i = 0; i < this.BOARD_SIZE; i++) {
            const x = this.BOARD_PADDING + i * this.CELL_SIZE;
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.BOARD_PADDING);
            this.ctx.lineTo(x, this.BOARD_PADDING + (this.BOARD_SIZE - 1) * this.CELL_SIZE);
            this.ctx.stroke();
        }
        
        // 绘制星位（天元和四个角的星位）
        this.drawStarPositions();
        
        // 重新绘制所有棋子
        this.drawAllPieces();
    }
    
    // 绘制星位
    drawStarPositions() {
        const starPositions = [
            [3, 3], [3, 11], [11, 3], [11, 11], [7, 7] // 天元和四个角
        ];
        
        this.ctx.fillStyle = '#8B4513';
        starPositions.forEach(([row, col]) => {
            const x = this.BOARD_PADDING + col * this.CELL_SIZE;
            const y = this.BOARD_PADDING + row * this.CELL_SIZE;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, 2 * Math.PI);
            this.ctx.fill();
        });
    }
    
    // 绘制所有棋子
    drawAllPieces() {
        for (let row = 0; row < this.BOARD_SIZE; row++) {
            for (let col = 0; col < this.BOARD_SIZE; col++) {
                if (this.gameBoard[row][col]) {
                    this.drawPiece(row, col, this.gameBoard[row][col]);
                }
            }
        }
    }
    
    // 绘制单个棋子
    drawPiece(row, col, color) {
        const x = this.BOARD_PADDING + col * this.CELL_SIZE;
        const y = this.BOARD_PADDING + row * this.CELL_SIZE;
        const radius = this.CELL_SIZE * 0.4;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        
        // 设置棋子颜色和阴影
        if (color === 'black') {
            this.ctx.fillStyle = '#000000';
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        } else {
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        }
        
        this.ctx.shadowBlur = 2;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;
        this.ctx.fill();
        
        // 重置阴影
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        
        // 绘制棋子边框
        this.ctx.strokeStyle = color === 'black' ? '#333333' : '#CCCCCC';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }
    
    // 处理鼠标点击事件
    handleClick(event) {
        if (this.gameOver) return;
        
        // 获取鼠标在画布上的坐标
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // 计算点击的棋盘位置
        const col = Math.round((x - this.BOARD_PADDING) / this.CELL_SIZE);
        const row = Math.round((y - this.BOARD_PADDING) / this.CELL_SIZE);
        
        // 检查是否在有效范围内
        if (row >= 0 && row < this.BOARD_SIZE && col >= 0 && col < this.BOARD_SIZE) {
            // 检查该位置是否为空
            if (!this.gameBoard[row][col]) {
                // 放置棋子
                this.placePiece(row, col);
            }
        }
    }
    
    // 放置棋子
    placePiece(row, col) {
        // 在棋盘数组中记录棋子
        this.gameBoard[row][col] = this.currentPlayer;
        
        // 添加到历史记录
        this.gameHistory.push({
            row,
            col,
            player: this.currentPlayer
        });
        
        // 绘制棋子
        this.drawPiece(row, col, this.currentPlayer);
        
        // 检查是否获胜
        if (this.checkWin(row, col)) {
            this.gameOver = true;
            this.gameStatusElement.textContent = `${this.currentPlayer === 'black' ? '黑棋' : '白棋'}获胜！`;
            return;
        }
        
        // 检查是否平局
        if (this.gameHistory.length === this.BOARD_SIZE * this.BOARD_SIZE) {
            this.gameOver = true;
            this.gameStatusElement.textContent = '平局！';
            return;
        }
        
        // 切换玩家
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        this.updateGameInfo();
    }
    
    // 检查是否获胜
    checkWin(row, col) {
        const directions = [
            [0, 1],   // 水平方向
            [1, 0],   // 垂直方向
            [1, 1],   // 对角线方向
            [1, -1]   // 反对角线方向
        ];
        
        for (const [dx, dy] of directions) {
            let count = 1; // 包括当前棋子
            
            // 向正方向检查
            for (let i = 1; i < 5; i++) {
                const newRow = row + dx * i;
                const newCol = col + dy * i;
                if (newRow >= 0 && newRow < this.BOARD_SIZE && 
                    newCol >= 0 && newCol < this.BOARD_SIZE &&
                    this.gameBoard[newRow][newCol] === this.currentPlayer) {
                    count++;
                } else {
                    break;
                }
            }
            
            // 向负方向检查
            for (let i = 1; i < 5; i++) {
                const newRow = row - dx * i;
                const newCol = col - dy * i;
                if (newRow >= 0 && newRow < this.BOARD_SIZE && 
                    newCol >= 0 && newCol < this.BOARD_SIZE &&
                    this.gameBoard[newRow][newCol] === this.currentPlayer) {
                    count++;
                } else {
                    break;
                }
            }
            
            // 如果有5个或更多连续棋子，则获胜
            if (count >= 5) {
                return true;
            }
        }
        
        return false;
    }
    
    // 悔棋功能
    undoMove() {
        if (this.gameHistory.length === 0 || this.gameOver) return;
        
        // 获取最后一步棋
        const lastMove = this.gameHistory.pop();
        
        // 从棋盘移除棋子
        this.gameBoard[lastMove.row][lastMove.col] = null;
        
        // 切换回上一个玩家
        this.currentPlayer = lastMove.player;
        
        // 更新UI
        this.updateGameInfo();
        this.drawBoard();
    }
    
    // 更新游戏信息显示
    updateGameInfo() {
        this.currentPlayerElement.textContent = this.currentPlayer === 'black' ? '黑棋' : '白棋';
        this.currentPlayerElement.style.color = this.currentPlayer === 'black' ? '#000000' : '#666666';
        
        if (!this.gameOver) {
            this.gameStatusElement.textContent = '游戏进行中';
        }
    }
    
    // 绑定事件监听器
    bindEvents() {
        // 画布点击事件
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        
        // 重新开始按钮
        this.restartBtn.addEventListener('click', () => this.initGame());
        
        // 悔棋按钮
        this.undoBtn.addEventListener('click', () => this.undoMove());
        
        // 鼠标悬停效果
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
    }
    
    // 鼠标移动事件处理
    handleMouseMove(event) {
        if (this.gameOver) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const col = Math.round((x - this.BOARD_PADDING) / this.CELL_SIZE);
        const row = Math.round((y - this.BOARD_PADDING) / this.CELL_SIZE);
        
        // 如果在有效范围内且位置为空，显示预览
        if (row >= 0 && row < this.BOARD_SIZE && col >= 0 && col < this.BOARD_SIZE && !this.gameBoard[row][col]) {
            this.canvas.style.cursor = 'pointer';
        } else {
            this.canvas.style.cursor = 'default';
        }
    }
    
    // 鼠标离开事件处理
    handleMouseLeave() {
        this.canvas.style.cursor = 'default';
    }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new GomokuGame();
});