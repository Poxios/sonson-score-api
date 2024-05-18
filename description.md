# Scoreboard API 명세서

## 엔드포인트

### 1. 점수 추가 (POST /score)
- **설명**: 새로운 점수를 추가합니다.
- **요청**:
  - **URL**: `/score`
  - **메서드**: `POST`
  - **본문**:
    ```json
    {
      "name": "string",
      "score": "number",
      "data": "string"
    }
    ```
- **응답**:
  - **성공**: 201 Created
  - **실패**: 400 Bad Request (입력값 오류)

### 2. 점수 조회 (GET /scores)
- **설명**: 상위 10개의 점수를 조회합니다.
- **요청**:
  - **URL**: `/scores`
  - **메서드**: `GET`
- **응답**:
  - **성공**: 200 OK
    ```json
    [
      {
        "id": 1,
        "name": "Player1",
        "score": 100,
        "region": "Region1"
      },
      ...
    ]
    ```

### 3. 점수 삭제 (DELETE /scores)
- **설명**: 모든 점수 데이터를 삭제합니다. 개발자 전용 요청입니다.
- **요청**:
  - **URL**: `/scores`
  - **메서드**: `DELETE`
  - **본문**:
    ```json
    {
      "password": "dangerouspassword123!"
    }
    ```
- **응답**:
  - **성공**: 200 OK (삭제 성공)
  - **실패**: 403 Forbidden (비밀번호 오류)
